import { h } from "preact";
import { NewTabPageController } from "./new-tab-page.controller";
import { useController } from "../../hooks/use-controller.hook";

export default function NewTabPage(props) {
  const ctrl = useController(NewTabPageController, props, [props.pageId]);

  return (
    <main class="page" key={props.pageId}>
      <form
        id="new-tab-form"
        class="flex justify-center mt-24"
        {...ctrl.form.props}
      >
        <div class="form-control w-full max-w-2xl">
          <label class="label">
            <span class="label-text">Paste share link</span>
          </label>
          <div class="join">
            <input
              type="text"
              name="href"
              value={ctrl.form.state.href.value}
              class="join-item input input-bordered w-full invalid:input-error"
              onInput={ctrl.form.handleInput}
              required
            />
            <button class="btn join-item">Go</button>
          </div>
        </div>
      </form>
    </main>
  );
}
