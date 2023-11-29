import { h } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { useSignalEffect } from "@preact/signals";

export default function Modal({ open, openSignal, children, id }) {
  const modal = useRef();

  useEffect(() => {
    if (open == null) return;

    if (open) {
      modal.current.showModal();
    } else {
      modal.current.close();
    }
  }, [open]);

  useSignalEffect(() => {
    if (!openSignal) return;

    if (openSignal.value) {
      modal.current.showModal();
    } else {
      modal.current.close();
    }
  });

  return (
    <dialog ref={modal} class="modal" id={id}>
      {children}
    </dialog>
  );
}
