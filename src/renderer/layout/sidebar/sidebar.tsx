import { h } from "preact";
import { styles } from "@/renderer/utils";
import UserMenu from "./user-menu/user-menu";
import Subscriptions from "./subscriptions/subscriptions";
import { UserIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Pages from "./pages/pages";
import { SidebarStore, SidebarTab } from "@/renderer/stores/sidebar.store";
import { useProvider } from "@/renderer/hooks";

const navTabs = [
  { tab: SidebarTab.Subscriptions, title: "Subscriptions" },
  { tab: SidebarTab.UserMenu, title: <UserIcon class="w-4 h-4 text-inherit" /> },
  { tab: SidebarTab.Pages, title: "Pages" },
];

export default function Sidebar() {
  const sidebarStore = useProvider<SidebarStore>(SidebarStore);

  const selectedTab = sidebarStore.state.tab.value;

  return (
    <section class="p-4 w-96 flex flex-col h-full bg-base-300 text-base-content">
      <label
        htmlFor="sidebar-drawer"
        class="btn btn-ghost btn-circle lg:hidden self-end"
      >
        <XMarkIcon class="h-6 w-6 text-current" />
      </label>
      <div class="tabs tabs-bordered mb-8" onClick={sidebarStore.selectTab}>
        {navTabs.map((navTab) => (
          <a
            key={navTab.tab}
            data-tab={navTab.tab}
            class={styles({
              "tab": true,
              "tab-active": selectedTab === navTab.tab,
            })}
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
