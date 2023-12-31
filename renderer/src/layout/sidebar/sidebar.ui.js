import { h } from "preact";
import { styles } from "../../lib/utils";
import SidebarMenu from "./menu/menu.ui";
import SidebarPublishers from "./publishers/sidebar-publishers.ui";
import SidebarBookmarks from "./bookmarks/sidebar-bookmarks.ui";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useController } from "../../hooks/use-controller.hook";
import { SidebarController } from "./sidebar.controller";

const navTabs = [
  { title: "Publishers" },
  { title: "Bookmarks" },
  { title: "Menu" },
];

export default function Sidebar() {
  const ctrl = useController(SidebarController);

  return (
    <section class="p-4 w-96 flex flex-col h-full bg-base-300 text-base-content">
      <div class="flex justify-between mb-8">
        <div class="tabs" onClick={ctrl.selectTab}>
          {navTabs.map((navTab, tabIndex) => (
            <a
              key={tabIndex}
              data-index={tabIndex}
              class={styles({
                "tab tab-bordered": true,
                "tab-active": ctrl.state.tabIndex.value === tabIndex,
              })}
            >
              {navTab.title}
            </a>
          ))}
        </div>
        <label
          htmlFor="sidebar-drawer"
          class="btn btn-ghost btn-circle lg:hidden"
        >
          <XMarkIcon class="h-6 w-6 text-current" />
        </label>
      </div>
      {ctrl.state.tabIndex.value === 0 && <SidebarPublishers />}
      {ctrl.state.tabIndex.value === 1 && <SidebarBookmarks />}
      {ctrl.state.tabIndex.value === 2 && <SidebarMenu />}
    </section>
  );
}
