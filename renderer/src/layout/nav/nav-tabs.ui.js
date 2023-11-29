import { h } from "preact";
import { Link } from "preact-router";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { styles } from "../../lib/utils";
import { useController } from "../../hooks/use-controller.hook";
import { NavController } from "./nav.controller";

export default function NavTabs(props) {
  const ctrl = useController(NavController, props);
  const { navStore } = ctrl;

  const active = ctrl.navStore.active.value;

  return (
    <nav class="tabs flex-nowrap">
      {navStore.state.tabs.value.map((tab, tabIndex) => {
        // Page that is active within the tab's history
        const page = tab.pages.find((p) => p.id === tab.pageId);
        const tabIsActive = active && tabIndex === active.tabIndex;

        return (
          <div
            key={tab.pageId}
            class={styles({
              "group tab tab-lifted flex-auto": true,
              "tab-active": tabIsActive,
            })}
          >
            {/* Page title */}
            <Link
              href={`/${page.id}/${page.href}`}
              class="flex-1 mr-2 truncate"
            >
              {page.title}
            </Link>

            {/* Close tab button */}
            <button
              class={styles({
                "rounded-lg group-hover:block": true,
                block: tabIsActive,
                hidden: !tabIsActive,
              })}
              data-index={tabIndex}
              onClick={ctrl.handleCloseClick}
            >
              <XMarkIcon class="w-4 h-4 text-inherit" />
            </button>
          </div>
        );
      })}
    </nav>
  );
}
