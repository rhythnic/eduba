/**
 * Maintain a least-recently-used cache of hyperdrives or hyperbees
 * Watch all DBs in the cache and emit changes to the DB
 * Joined DBs are always joined to the swarm and always watched
 * Loaded DBs are joined to the swarm until expired from the cache
 * Rotate subscriptions through the cache
 */

const { uniq } = require("ramda");
const QuickLru = require("../quick-lru");
const { Emitter } = require("../../../lib/emitter");
const { StorageChangeType } = require("./enums");
const { DbChanged } = require("./events");

class DbService extends Emitter {
  constructor({ store, swarm, root }) {
    super();
    // the key prefix to watch in hyperdrive
    this.root = root;
    // corestore
    this.corestore = store;
    this.store = store;
    // hyperswarm
    this.swarm = swarm;
    // cache of joined drives/bees
    this.joined = new Map();
    // IDs of subscribed drives/bees
    this.subscribedIds = [];
    // cache of watchers of drives/bees
    this.watchers = new Map();
    // Interval ID for subscription management
    this.subscriptionIntervalId = void 0;
    // Least-recently used cache of drives/bees
    this.dbs = new QuickLru({
      maxSize: 25,
      onEviction: this._evictDb.bind(this),
    });

    this.setMaxListeners(50);
  }

  isDb(instance) {
    return this._isDb(instance);
  }

  async db(opts) {
    if (this.isDb(opts)) return opts;

    if (!this.store) {
      throw new Error("Must set store before using service.");
    }

    const dbId = typeof opts === "string" ? opts : opts.key;

    if (typeof dbId === "string") {
      if (this.joined.has(dbId)) return this.joined.get(dbId);
      if (this.dbs.has(dbId)) return this.dbs.get(dbId);
    }

    const core = await this.store.get(opts);
    await core.ready();

    if (this.joined.has(core.id)) return this.joined.get(core.id);
    if (this.dbs.has(core.id)) return this.dbs.get(core.id);

    const db = this._db(core, this.store);
    await db.ready();

    this.dbs.set(db.id, db);
    this._watchDb(db);

    return db;
  }

  /**
   * End a Corestore session
   * Clear the caches and set store back to rootStore
   * Used as trigger to stop the subscription interval
   */
  async endSession() {
    clearInterval(this.subscriptionIntervalId);

    await Promise.all(
      Array.from(this.joined.values()).map((db) =>
        this._leaveSwarmInteral(db.discoveryKey)
      )
    );

    this.joined.clear();

    await Promise.all(
      Array.from(this.dbs.entries()).map(([id, db]) => this._evictDb(id, db))
    );

    this.dbs.clear();
    this.watchers.clear();
    this.subscribedIds = [];
    this.store = this.corestore;
  }

  async joinSwarm(db) {
    db = await this.db(db);
    this.joined.set(db.id, db);
    this._joinSwarmInteral(db.discoveryKey);
  }

  async leaveSwarm(db) {
    db = await this.db(db);
    this.joined.delete(db.id);
    await this._leaveSwarmInteral(db.discoveryKey);
    // Ensure db is in LRU cache so it can eventually be evicted and closed
    this.dbs.set(db.id, db);
  }

  /**
   * Get the db and join it to the Hyperswarm
   * until it expires from the LRU cache.
   * @param {Hyperdrive | string | object} db
   * @returns
   */
  async load(db) {
    db = await this.db(db);
    if (!db.writable) {
      this._joinSwarmInteral(db.discoveryKey);
    }
    return db;
  }

  /**
   * Start a Corestore session
   * Used as trigger to start the subscription interval
   * @param {string} primaryKey
   */
  startSession(store) {
    this.store = store;
    this.subscriptionIntervalId = setInterval(() => {
      if (this.subscribedIds.length) {
        const dbId = this.subscribedIds.pop();
        this.load(dbId).catch((err) => this.emit("error", err));
        this.subscribedIds.unshift(dbId);
      }
    }, 1000 * 60);
  }

  /**
   * Subscribe to db
   * Add db ID to list of drives that are joined to swarm periodically
   * @param {string} dbId
   */
  async subscribe(dbId) {
    this.subscribedIds = uniq([...this.subscribedIds, dbId]);
  }

  /**
   * Unsubscribe from db
   * @param {string} dbId
   */
  async unsubscribe(dbId) {
    this.subscribedIds = this.subscribedIds.filter((id) => id === dbId);
  }

  async waitForKeyToExist(db, key, maxWait = 5000) {
    return new Promise(async (resolve, reject) => {
      try {
        db = await this.db(db);

        if (await this._exists(db, key)) {
          this.load(db);
          resolve(true);
          return;
        }

        const respond = () => {
          this.off(DbChanged, eventHandler);
          this._exists(db, key).then(resolve, reject);
        };

        const eventHandler = (evt) => {
          if (evt.dbId === db.id && evt.key === key) {
            clearTimeout(timer);
            respond();
          }
        };

        const timer = setTimeout(respond, maxWait);
        this.on(DbChanged, eventHandler);
        this.load(db);
      } catch (err) {
        reject(err);
      }
    });
  }

  async _joinSwarmInteral(discoveryKey) {
    const peerDiscovery = await this.swarm.status(discoveryKey);
    if (!peerDiscovery) {
      await this.swarm.join(discoveryKey);
    }
  }

  async _leaveSwarmInteral(discoveryKey) {
    const peerDiscovery = await this.swarm.status(discoveryKey);
    if (peerDiscovery) {
      await peerDiscovery.destroy();
    }
  }

  async _evictDb(id, db) {
    try {
      // If joined, keep db in cache
      if (this.joined.has(id)) return;

      const watcher = this.watchers.get(db.id);
      if (watcher) {
        await watcher.destroy();
        this.watchers.delete(db.id);
      }

      this._leaveSwarmInteral(db.discoveryKey);

      await db.close();
    } catch (err) {
      this.emit("error", new Error(`Error on evicting DB: ${err.message}`));
    }
  }

  async _watchDb(db) {
    if (this.watchers.has(db.id)) return;

    try {
      const watcher = db.watch(this.root);
      this.watchers.set(db.id, watcher);

      for await (const [current, previous] of watcher) {
        const diff = this._diff(current, previous);
        diff.on("data", ({ left, right }) => {
          let type;
          if (left) {
            type = right ? StorageChangeType.Update : StorageChangeType.Create;
          } else {
            type = StorageChangeType.Delete;
          }

          this.emit(DbChanged, {
            type,
            dbId: db.id,
            key: (left || right).key,
            version: current.version,
            previousVersion: previous.version,
          });
        });

        diff.on("error", (err) => {
          this.emit("error", err);
        });
      }
    } catch (err) {
      this.emit("error", err);
    }
  }
}

module.exports = {
  DbService,
};
