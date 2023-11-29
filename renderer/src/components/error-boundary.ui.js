import { h } from "preact";
import { useErrorBoundary } from "preact/hooks";
import Modal from "./modal.ui";

export default function ErrorBoundary({
  reportError,
  title,
  message,
  resetLabel,
  children,
}) {
  const [error, resetError] = useErrorBoundary((error) => {
    if (reportError) reportError(error);
  });

  if (error) {
    return (
      <Modal open={!!error}>
        <div class="modal-box">
          <h3 class="font-bold text-lg">{title}</h3>
          <p class="mt-2">{message}</p>
          <div class="modal-action">
            <button class="btn" onClick={resetError}>
              {resetLabel}
            </button>
          </div>
        </div>
      </Modal>
    );
  } else {
    return children;
  }
}
