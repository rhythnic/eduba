import { h } from "preact";
import { useProviders } from "../hooks/use-providers.hook";

export default function TabLink({
  pageTitle,
  href,
  replace = false,
  newTab = false,
  class: className,
  children,
}) {
  const [navStore] = useProviders(["navStore"]);

  function handleClick(evt) {
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
