import { h } from "preact";
import Sidebar from "./sidebar/sidebar.ui";
import Nav from "./nav/nav.ui";
import ErrorBoundary from "../components/error-boundary.ui";
import { useProviders } from "../hooks/use-providers.hook";

export default function Layout({ children }) {
  const [appStore] = useProviders(["appStore"]);

  return (
    <ErrorBoundary
      reportError={appStore.reportError}
      title="Something went wrong"
      message="Eduba experienced an error."
      resetLabel="Try again"
    >
      <div class="w-screen h-screen drawer lg:drawer-open ">
        <input id="sidebar-drawer" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content flex flex-col overflow-hidden">
          <Nav />
          {children}
        </div>
        <div class="drawer-side">
          <label htmlFor="sidebar-drawer" class="drawer-overlay"></label>
          <Sidebar />
        </div>
      </div>
    </ErrorBoundary>
  );
}
