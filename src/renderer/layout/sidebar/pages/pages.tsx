import { h } from "preact";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Link } from "preact-router/match";
import { useController, useProvider } from "@/renderer/hooks";
import { SidebarStore } from "@/renderer/stores";
import { styles } from "@/renderer/utils";
import { PagesController } from "./pages.ctrl";

export default function Pages() {
    const ctrl = useController<never, PagesController>(PagesController);
    const sidebarStore = useProvider<SidebarStore>(SidebarStore);

    return (
        <div>
          <div class="flex items-center">
            <h2 class="font-bold mr-4">Pages</h2>
            <Link href="/newtab" class="btn btn-circle btn-ghost" >
                <PlusIcon class="w-6 h-6 text-inherit" />
            </Link>
          </div>
          <ul>
            {sidebarStore.state.pages.value.map((page) => (
              <li class="flex items-center justify-between group p-2 hover:bg-blue-300">
                <Link href={`/${page.id}/${page.href}`}>
                  {page.title || "Loading"}
                </Link>
                <button
                  class={styles({
                    "invisible group-hover:visible": true
                  })}
                  onClick={ctrl.closePage}
                  data-page={page.id}
                >
                  <XMarkIcon class="w-6 h-6 text-inherit" />
                </button>
              </li>
            ))}
          </ul>
        </div>
    );
}