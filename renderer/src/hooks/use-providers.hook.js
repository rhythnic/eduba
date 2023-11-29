import { useContext } from "preact/hooks";
import { AppContext } from "../app";

export function useProviders(names) {
  const app = useContext(AppContext);
  return names.map((name) => app.resolve(name));
}
