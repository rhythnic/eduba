import { h, Fragment } from "preact";
import { FilmIcon } from "@heroicons/react/24/solid";
import Modal from "../../../components/modal.ui";
import SubmitCancel from "../../../components/submit-cancel.ui";
import { useContext } from "preact/hooks";
import { ArticleEditPageContext } from "../article-edit-page.controller";
import { useSubController } from "../../../hooks/use-controller.hook";
import { ArticleEditToolController } from "./article-edit-tool.controller";

export default function VideoInserter(props) {
  const pageCtrl = useContext(ArticleEditPageContext);

  const ctrl = useSubController(
    pageCtrl,
    VideoInserter.name,
    { cache: true },
    VideoInserterController,
    props
  );

  return (
    <>
      <button
        class="join-item btn btn-ghost"
        title="Upload video"
        onClick={ctrl.openModal}
      >
        <FilmIcon class="w-5 h-5 text-inherit" />
      </button>
      <Modal openSignal={ctrl.state.open}>
        <form {...ctrl.form.props} class="modal-box">
          <h3 class="font-bold text-lg">Upload Video</h3>
          <div class="form-control w-full max-w-xs">
            <input
              type="text"
              placeholder="Title"
              name="title"
              class="input input-bordered w-full max-w-xs mt-2"
              value={ctrl.form.state.title.value}
              onInput={ctrl.form.handleInput}
              required
            />
            <label class="label">
              <span class="label-text-alt">Title of the video</span>
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
              <span class="label-text-alt">Caption shown under video</span>
            </label>
          </div>

          <SubmitCancel class="modal-action" onCancel={ctrl.cancel} />
        </form>
      </Modal>
    </>
  );
}

export class VideoInserterController extends ArticleEditToolController {
  _defineState() {
    return {
      title: { value: "", cache: true },
      caption: { value: "", cache: true },
    };
  }

  async buildInsertionText({ title, caption }) {
    const file = await window.api.selectVideoFile();

    const video = await window.api.createVideo({
      file,
      title,
      dbId: this.parentController.props.dbId,
      tags: [],
    });

    return `<eduba-video publisher="${video.dbId}" video="${video.id}" caption="${caption}"></eduba-video>`;
  }
}
