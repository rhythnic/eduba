import { h, Fragment } from "preact";
import TabLink from "@/renderer/components/tab-link";
import { useController } from "@/renderer/hooks/use-controller.hook";
import { SidebarPublishersController } from "./sidebar-publishers.ctrl";
import {
  EllipsisVerticalIcon,
  PlusCircleIcon,
  SignalIcon,
  SignalSlashIcon,
} from "@heroicons/react/24/solid";
import { useProvider } from "@/renderer/hooks";
import { PublisherStore } from "@/renderer/stores";

export default function SidebarPublishers() {
  const ctrl = useController<never, SidebarPublishersController>(
    SidebarPublishersController
  );

  const publisherStore = useProvider<PublisherStore>(PublisherStore);

  return (
    <div>
      {!!ctrl.state.userPublishers.value.length && (
        <div>
          <h2 class="font-bold">My Publishers</h2>
          <ul class="menu w-full rounded-box">
            {ctrl.state.userPublishers.value.map((publisher) => (
              <li class="flex-row">
                <TabLink
                  href={`${publisher._db}/articles/${publisher.article._id}`}
                  newTab={true}
                  class="flex-1"
                >
                  {publisher.article.title}
                </TabLink>
                <div class="dropdown dropdown-bottom dropdown-end">
                  <label tabIndex={0} class="cursor-pointer">
                    <EllipsisVerticalIcon class="w-5 h-5 text-inherit" />
                  </label>
                  <ul
                    tabIndex={0}
                    class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52"
                  >
                    <li>
                      <TabLink
                        pageTitle="New Article"
                        href={`edit/articles/${publisher._db}`}
                        newTab={true}
                        class="join-item mr-4"
                      >
                        <PlusCircleIcon class="w-6 h-6 text-inherit" />
                        Create Article
                      </TabLink>
                    </li>
                    <li>
                      <a
                        onClick={() =>
                          publisherStore.togglePublisherPinned(publisher)
                        }
                      >
                        {publisher._pinned ? (
                          <>
                            <SignalIcon class="w-6 h-6 text-inherit" />
                            Serving
                          </>
                        ) : (
                          <>
                            <SignalSlashIcon class="w-6 h-6 text-inherit" />
                            Not Serving
                          </>
                        )}
                      </a>
                    </li>
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <h2 class="font-bold mt-2">Subscriptions</h2>
      <ul class="menu w-full rounded-box">
        {ctrl.state.subscribedPublishers.value.map((publisher) => (
          <li>
            <TabLink
              href={`${publisher._db}/articles/${publisher.article._id}`}
              newTab={true}
              class="flex-1"
            >
              {publisher.article.title}
            </TabLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
