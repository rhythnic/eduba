import { IpcApi } from "@/api/ipc/types";
import { ComponentController } from "@/renderer/controllers/component.ctrl";
import { TYPES } from "@/renderer/di";
import { inject, injectable } from "inversify";
import { createContext } from "preact";

export const SidebarMenuContext = createContext(null);

@injectable()
export class SidebarMenuController extends ComponentController<never>{
  public backupModalId = "backup-modal";
  public newPublisherModalId = "new-publisher-modal";

  constructor(
    @inject(TYPES.Document) private readonly document: Document,
    @inject(TYPES.IpcSdk) private readonly ipcSdk: IpcApi
  ){
    super();
  }

  openBackup = () => {
    const modal = this.document.getElementById(this.backupModalId);
    if (modal instanceof HTMLDialogElement) {
      modal.showModal();
    }
  };

  closeBackup = () => {
    const modal = this.document.getElementById(this.backupModalId);
    if (modal instanceof HTMLDialogElement) {
      modal.close();
    }
  };

  openNewPublisher = () => {
    const modal = this.document.getElementById(this.newPublisherModalId);
    if (modal instanceof HTMLDialogElement) {
      modal.showModal();
    }
  };

  closeNewPublisher = () => {
    const modal = this.document.getElementById(this.newPublisherModalId);
    if (modal instanceof HTMLDialogElement) {
      modal.close();
    }
  };

  signOut = () => {
    this.ipcSdk.auth.signOut();
  }
}
