import { h } from "preact";
import Authentication from "./auth.ui";
import Backup from "./backup.ui";
import { useController } from "../../../hooks/use-controller.hook";
import { SidebarMenuContext, SidebarMenuController } from "./menu.controller";
import TabLink from "../../../components/tab-link.ui";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";

export default function SidebarMenu(props) {
  const ctrl = useController(SidebarMenuController, props);
  const sessionActive = ctrl.authStore.state.sessionActive.value;

  return (
    <SidebarMenuContext.Provider value={ctrl}>
      <div class="flex-1 flex flex-col justify-between">
        <ul className="menu w-full rounded-box">
          {sessionActive && (
            <li>
              <TabLink
                pageTitle="Create Publisher"
                href="edit/articles"
                newTab={true}
              >
                Create Publisher
              </TabLink>
            </li>
          )}
          {sessionActive && (
            <li>
              <a onClick={ctrl.openBackup}>Backup / Restore</a>
            </li>
          )}
          {sessionActive && (
            <li>
              <a onClick={ctrl.authStore.signOut}>
                <ArrowRightOnRectangleIcon class="w-6 h-6 text-inherit" /> sign
                out
              </a>
            </li>
          )}
        </ul>

        {sessionActive && <Backup onDone={ctrl.closeBackup} />}

        {!sessionActive && <Authentication />}
      </div>
    </SidebarMenuContext.Provider>
  );
}
