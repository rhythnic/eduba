import { useContext } from "preact/hooks";
import { DiContext } from "../di";
import { Container } from "inversify";

export function useProvider<T>(identifier: any): T {
  const diContainer = useContext<Container>(DiContext);
  return diContainer.get<T>(identifier);
}
