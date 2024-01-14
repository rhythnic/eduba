import { h } from "preact";
import Auth from "./auth/auth";
import Backup from "./backup/backup";
import { useController } from "../../../hooks/use-controller.hook";
import { SidebarMenuContext, SidebarMenuController } from "./menu.ctrl";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { useProvider } from "@/renderer/hooks";
import { AuthStore } from "@/renderer/stores";
import NewPublisher from "./new-publisher/new-publisher";

export default function SidebarMenu() {
  const ctrl = useController<never, SidebarMenuController>(SidebarMenuController);
  
  const authStore = useProvider<AuthStore>(AuthStore);

  const sessionActive = authStore.state.sessionActive.value;

  return (
    <SidebarMenuContext.Provider value={ctrl}>
      <div class="flex-1 flex flex-col justify-between">
        <ul className="menu w-full rounded-box">
          {sessionActive && (
            <li>
              <button class="" onClick={ctrl.openNewPublisher}>
                Create Publisher
            </button>
            </li>
          )}
          {sessionActive && (
            <li>
              <a onClick={ctrl.openBackup}>Backup / Restore</a>
            </li>
          )}
          {sessionActive && (
            <li>
              <a onClick={ctrl.signOut}>
                <ArrowRightOnRectangleIcon class="w-6 h-6 text-inherit" /> sign
                out
              </a>
            </li>
          )}
        </ul>

        {sessionActive && <NewPublisher onClose={ctrl.closeNewPublisher} />}

        {sessionActive && <Backup onClose={ctrl.closeBackup} />}

        {!sessionActive && <Auth />}
      </div>
    </SidebarMenuContext.Provider>
  );
}
