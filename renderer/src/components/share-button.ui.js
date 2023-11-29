import { h } from "preact";
import { useContext } from "preact/hooks";
import { ShareIcon } from "@heroicons/react/24/solid";
import { AppContext } from "../controllers/app.controller";
import { Alert } from "../events";
import { AlertType } from "../enums";

export default function ShareButton({ href, ...props }) {
  const app = useContext(AppContext);

  function handleClick() {
    window.rendererEvents.copyToClipboard(href);

    app.emitter.emit(Alert, {
      type: AlertType.Info,
      message: "Copied to clipboard",
      timeout: 3000,
    });
  }

  return (
    <button {...props} onClick={handleClick}>
      <ShareIcon class="w-6 h-6 text-inherit" />
    </button>
  );
}
