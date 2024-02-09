import { ComponentChildren, h } from "preact";
import Sidebar from "./sidebar/sidebar";
import ErrorBoundary from "../components/error-boundary";
import { useProvider } from "../hooks/use-provider.hook";
import { AppStore } from "../stores";

export interface LayoutProps {
  children?: ComponentChildren
}

export default function Layout({ children }: LayoutProps) {
  const appStore = useProvider<AppStore>(AppStore);

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
          {children}
        </div>
        <div class="drawer-side text-base-content">
          <label htmlFor="sidebar-drawer" class="drawer-overlay"></label>
          <Sidebar />
        </div>
      </div>
    </ErrorBoundary>
  );
}
