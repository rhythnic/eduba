import { ComponentChildren, h } from "preact";
import { useProvider } from "../hooks/use-provider.hook";
import { NavStore } from "../stores";

export interface TabLinkProps {
  pageTitle?: string;
  href: string;
  replace?: boolean;
  newTab?: boolean;
  class?: string;
  children: ComponentChildren;
}

export default function TabLink({
  pageTitle,
  href,
  replace = false,
  newTab = false,
  class: className,
  children,
}: TabLinkProps) {
  const navStore = useProvider<NavStore>(NavStore);

  function handleClick(evt: Event) {
    evt.preventDefault();
    const page = { title: pageTitle, href };

    if (newTab) {
      navStore.insertTab(page);
    } else {
      navStore.insertPage(page, replace);
    }
  }

  return (
    <a href="#" class={className} onClick={handleClick}>
      {children}
    </a>
  );
}
