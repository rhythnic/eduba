import { Container } from "inversify";
import { TYPES } from "./types";
import { Emitter } from "@/lib/emitter";
import { IpcApi, IpcEvents } from "@/api/ipc/types";
import { AppStore, AuthStore, BookmarkStore, NavStore, PublisherStore, SidebarStore } from "../stores";
import { route } from "preact-router";
import { IRoute } from "../types";

export const diContainer = new Container({ autoBindInjectable: true });

// Window
diContainer.bind<Document>(TYPES.Document).toConstantValue(window.document);
diContainer.bind<Storage>(TYPES.LocalStorage).toConstantValue(window.localStorage);
diContainer.bind<IpcApi>(TYPES.IpcSdk).toConstantValue(window.ipcSdk);
diContainer.bind<IpcEvents>(TYPES.IpcEvents).toConstantValue(window.ipcEvents);

// Events
diContainer.bind<Emitter>(TYPES.Events).toConstantValue(new Emitter());

// Route
diContainer.bind<IRoute>(TYPES.Route).toConstantValue(route);

// Stores
diContainer.bind<AppStore>(AppStore).to(AppStore).inSingletonScope();
diContainer.bind<AuthStore>(AuthStore).to(AuthStore).inSingletonScope();
diContainer.bind<BookmarkStore>(BookmarkStore).to(BookmarkStore).inSingletonScope();
diContainer.bind<NavStore>(NavStore).to(NavStore).inSingletonScope();
diContainer.bind<PublisherStore>(PublisherStore).to(PublisherStore).inSingletonScope();
diContainer.bind<SidebarStore>(SidebarStore).to(SidebarStore).inSingletonScope();