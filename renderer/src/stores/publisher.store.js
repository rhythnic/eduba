export class PublisherStore {
  constructor(spec) {
    this.appStore = spec.appStore;
    this.navStore = spec.navStore;
  }

  createPublisher = async () => {
    const publisher = await window.api.createPublisher({
      ext: ".md",
    });
    const href = `edit/${publisher.dbId}/articles/${publisher.article}`;
    this.navStore.insertTab({ title: "New Publisher", href });
  };

  togglePublisherPinned = async (publisher) => {
    try {
      await window.api.updateUserPublisher({
        id: publisher.dbId,
        pinned: !publisher.pinned,
      });
    } catch (err) {
      this.appStore.reportError(err);
    }
  };
}
