import { h, Fragment } from "preact";
import {
  ArrowPathIcon,
  BackwardIcon,
  Bars3Icon,
  ForwardIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import NavTabs from "./nav-tabs";
import { styles } from "../../utils";
import { NavContext, NavController } from "./nav.ctrl";
import { useProvider, useController } from "@/renderer/hooks";
import { NavStore } from "@/renderer/stores";

export default function Nav() {
  const ctrl = useController<never, NavController>(NavController);
  const navStore = useProvider<NavStore>(NavStore);
  
  const showBackFwd = navStore.canGoBack.value || navStore.canGoForward.value;

  return (
    <NavContext.Provider value={ctrl}>
      <div class="join items-center">
        {/* Open/close drawer on mobile button */}
        <label
          htmlFor="sidebar-drawer"
          class="drawer-button join-item lg:hidden px-2"
        >
          <Bars3Icon class="h-6 w-6 text-current" />
        </label>

        {/* Refresh Button */}
        {navStore.state.tabs.value.length > 0 && (
          <button class="join-item px-2" onClick={() => location.reload()}>
            <ArrowPathIcon class="w-6 h-6 text-inherit" />
          </button>
        )}
        {/* Back/Forward buttons (visible if a tab is open) */}
        {showBackFwd && (
          <>
            <button
              class={styles({
                "join-item py-1 mx-2": true,
                "text-base-300": !navStore.canGoBack.value,
              })}
              onClick={navStore.goBack}
              disabled={!navStore.canGoBack.value}
            >
              <BackwardIcon class="w-4 h-4 text-inherit" />
            </button>
            <button
              class={styles({
                "join-item py-1 mx-2": true,
                "text-base-300": !navStore.canGoForward.value,
              })}
              onClick={navStore.goForward}
              disabled={!navStore.canGoForward.value}
            >
              <ForwardIcon class="w-4 h-4 text-inherit" />
            </button>
          </>
        )}

        <NavTabs />

        {/* Add new tab button */}
        <button class="py-1 mx-2" onClick={navStore.addNewTab}>
          <PlusIcon class="h-6 w-6 text-current" />
        </button>
      </div>
    </NavContext.Provider>
  );
}
