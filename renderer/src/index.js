import "./index.css";
import "./web-components";
import { h } from "preact";
import { app, AppContext } from "./app";
import Alerts from "./components/alerts.ui";
import Layout from "./layout/layout.ui";
import AppRouter from "./router.ui";

export default function App() {
  return (
    <AppContext.Provider value={app}>
      <Layout>
        <AppRouter />
      </Layout>
      <Alerts />
    </AppContext.Provider>
  );
}
