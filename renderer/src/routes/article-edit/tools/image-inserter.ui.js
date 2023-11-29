import { h, Fragment } from "preact";
import { PhotoIcon } from "@heroicons/react/24/solid";
import Modal from "../../../components/modal.ui";
import SubmitCancel from "../../../components/submit-cancel.ui";
import { useContext } from "preact/hooks";
import { ArticleEditPageContext } from "../article-edit-page.controller";
import { useSubController } from "../../../hooks/use-controller.hook";
import { ArticleEditToolController } from "./article-edit-tool.controller";

export default function ImageInserter(props) {
  const pageCtrl = useContext(ArticleEditPageContext);

  const ctrl = useSubController(
    pageCtrl,
    ImageInserter.name,
    { cache: true },
    ImageInserterController,
    props
  );

  return (
    <>
      <button
        class="join-item btn btn-ghost"
        title="Upload image"
        onClick={ctrl.openModal}
      >
        <PhotoIcon class="w-5 h-5 text-inherit" />
      </button>
      <Modal openSignal={ctrl.state.open}>
        <form {...ctrl.form.props} class="modal-box">
          <h3 class="font-bold text-lg">Upload Image</h3>
          <div class="form-control w-full max-w-xs">
            <input
              type="text"
              placeholder="Alternate Text"
              name="alt"
              class="input input-bordered w-full max-w-xs mt-2"
              value={ctrl.form.state.alt.value}
              onInput={ctrl.form.handleInput}
              required
            />
            <label class="label">
              <span class="label-text-alt">
                Short phrase that describes the image
              </span>
            </label>
          </div>

          <div class="form-control w-full max-w-xs">
            <input
              type="text"
              placeholder="Caption"
              name="caption"
              class="input input-bordered w-full max-w-xs mt-2"
              value={ctrl.form.state.caption.value}
              onInput={ctrl.form.handleInput}
            />
            <label class="label">
              <span class="label-text-alt">Caption shown under image</span>
            </label>
          </div>

          <SubmitCancel class="modal-action" onCancel={ctrl.cancel} />
        </form>
      </Modal>
    </>
  );
}

export class ImageInserterController extends ArticleEditToolController {
  _defineState() {
    return {
      alt: { value: "", cache: true },
      caption: { value: "", cache: true },
    };
  }

  async buildInsertionText({ alt, caption }) {
    const file = await window.api.selectImageFile();

    const image = await window.api.createImage({
      file,
      alt,
      dbId: this.parentController.props.dbId,
      tags: [],
    });

    return `<eduba-image publisher="${image.dbId}" image="${image.id}" caption="${caption}"></eduba-image>`;
  }
}
