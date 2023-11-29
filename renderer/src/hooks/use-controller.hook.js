import { useContext, useEffect, useMemo } from "preact/hooks";
import { AppContext } from "../app";

export function useController(Controller, props = {}, inputs = []) {
  const app = useContext(AppContext);

  const controller = useMemo(() => app.instantiate(Controller, props), inputs);
  controller.props = props;

  useEffect(() => {
    if (typeof controller.initialize === "function") {
      controller.initialize();
    }
    return () => {
      if (typeof controller.destroy === "funtion") {
        controller.destroy();
      }
    };
  }, inputs);

  return controller;
}

export function useSubController(
  parentController,
  key,
  subSpec,
  Controller,
  props,
  inputs
) {
  const storage = useMemo(
    () => parentController.sub(key, subSpec),
    (inputs = [])
  );
  const ctrl = useController(Controller, { ...props, storage }, inputs);
  ctrl.parentController = parentController;
  return ctrl;
}
