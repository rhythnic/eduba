import { h } from "preact";
import { styles } from "@/renderer/utils";
import UserMenu from "./user-menu/user-menu";
import Subscriptions from "./subscriptions/subscriptions";
import { UserIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Pages from "./pages/pages";
import { useController } from "@/renderer/hooks";
import { SidebarController, SidebarTab } from "./sidebar.ctrl";

const navTabs = [
  { tab: SidebarTab.Subscriptions, title: "Subscriptions" },
  { tab: SidebarTab.UserMenu, title: <UserIcon class="w-4 h-4 text-inherit" /> },
  { tab: SidebarTab.Pages, title: "Pages" },
];

export default function Sidebar() {
  const ctrl = useController<never, SidebarController>(SidebarController);

  const selectedTab = ctrl.state.tab.value;

  return (
    <section class="w-96 flex flex-col h-full">
      <label
        htmlFor="sidebar-drawer"
        class="btn btn-ghost btn-circle lg:hidden self-end"
      >
        <XMarkIcon class="h-6 w-6 text-current" />
      </label>
      <div class="tabs tabs-bordered mb-2 p-2">
        {navTabs.map((navTab) => (
          <a
            key={navTab.tab}
            data-tab={navTab.tab}
            class={styles({
              "tab": true,
              "tab-active": selectedTab === navTab.tab,
            })}
            onClick={ctrl.selectTab}
          >
            {navTab.title}
          </a>
        ))}
      </div>

      {selectedTab === SidebarTab.Subscriptions && <Subscriptions />}
      {selectedTab === SidebarTab.UserMenu && <UserMenu />}
      {selectedTab === SidebarTab.Pages && <Pages />}
    </section>
  );
}
