import { ComponentChildren, h } from "preact";
import { useProvider } from "../hooks/use-provider.hook";
import { SidebarStore } from "../stores";

export interface TabLinkProps {
  pageTitle?: string;
  href: string;
  class?: string;
  children: ComponentChildren;
}

export default function TabLink({
  pageTitle,
  href,
  class: className,
  children,
}: TabLinkProps) {
  const sidebarStore = useProvider<SidebarStore>(SidebarStore);

  function handleClick(evt: Event) {
    evt.preventDefault();
    sidebarStore.addPage({ title: pageTitle, href });
  }

  return (
    <a href="#" class={className} onClick={handleClick}>
      {children}
    </a>
  );
}
