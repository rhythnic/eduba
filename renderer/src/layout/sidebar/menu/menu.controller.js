import { createContext } from "preact";

export const SidebarMenuContext = createContext();

export class SidebarMenuController {
  constructor(spec) {
    this.authStore = spec.authStore;
    this.publisherStore = spec.publisherStore;
  }

  openBackup = () => {
    document.getElementById("backup-modal").showModal();
  };

  closeBackup = () => {
    document.getElementById("backup-modal").close();
  };
}
