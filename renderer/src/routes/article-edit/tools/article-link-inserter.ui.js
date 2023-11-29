import { h, Fragment } from "preact";
import { LinkIcon } from "@heroicons/react/24/solid";
import { shareArticlePattern } from "../../../constants";
import Modal from "../../../components/modal.ui";
import SubmitCancel from "../../../components/submit-cancel.ui";
import { useSubController } from "../../../hooks/use-controller.hook";
import { ArticleEditToolController } from "./article-edit-tool.controller";
import { useContext } from "preact/hooks";
import { ArticleEditPageContext } from "../article-edit-page.controller";

export default function ArticleLinkInserter(props) {
  const pageCtrl = useContext(ArticleEditPageContext);

  const ctrl = useSubController(
    pageCtrl,
    ArticleLinkInserter.name,
    { cache: true },
    ArticleLinkInserterController,
    props
  );

  return (
    <>
      <button
        class="join-item btn btn-ghost"
        title="Insert Article Link"
        onClick={ctrl.openModal}
      >
        <LinkIcon class="w-5 h-5 text-inherit" />
      </button>
      <Modal openSignal={ctrl.state.open}>
        <form {...ctrl.form.props} class="modal-box">
          <h3 class="font-bold text-lg">Insert Article Link</h3>
          <div class="form-control w-full max-w-xs">
            <input
              type="text"
              placeholder="Article Share Link"
              name="href"
              class="input input-bordered w-full max-w-xs mt-2"
              value={ctrl.form.state.href.value}
              onInput={ctrl.form.handleInput}
              required
            />
            <label class="label">
              <span class="label-text-alt">
                Text copied to clipboard after clicking an article's share icon
              </span>
            </label>
          </div>

          <div class="form-control w-full max-w-xs">
            <input
              type="text"
              placeholder="Label"
              name="label"
              class="input input-bordered w-full max-w-xs mt-2"
              value={ctrl.form.state.label.value}
              onInput={ctrl.form.handleInput}
            />
            <label class="label">
              <span class="label-text-alt">
                Text displayed for link. If not provided, article title will be
                used.
              </span>
            </label>
          </div>

          <SubmitCancel class="modal-action" onCancel={ctrl.cancel} />
        </form>
      </Modal>
    </>
  );
}

export class ArticleLinkInserterController extends ArticleEditToolController {
  _defineState() {
    return {
      href: { value: "", cache: true },
      label: { value: "", cache: true },
    };
  }

  buildInsertionText({ href, label }) {
    href = href.trim();
    label = label.trim();

    const parts = new RegExp(shareArticlePattern, "i").exec(href);

    // @TODO: better UI around invalid links
    if (!parts) return;

    return `<eduba-article publisher="${parts[1]}" article="${parts[2]}" label="${label}"></eduba-article>`;
  }
}
