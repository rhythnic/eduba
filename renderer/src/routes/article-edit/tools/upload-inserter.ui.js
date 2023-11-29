import { h, Fragment } from "preact";
import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import Modal from "../../../components/modal.ui";
import SubmitCancel from "../../../components/submit-cancel.ui";
import { useContext } from "preact/hooks";
import { ArticleEditPageContext } from "../article-edit-page.controller";
import { useSubController } from "../../../hooks/use-controller.hook";
import { ArticleEditToolController } from "./article-edit-tool.controller";

export default function UploadInserter(props) {
  const pageCtrl = useContext(ArticleEditPageContext);

  const ctrl = useSubController(
    pageCtrl,
    UploadInserter.name,
    { cache: true },
    UploadInserterController,
    props
  );

  return (
    <>
      <button
        class="join-item btn btn-ghost"
        title="Upload File"
        onClick={ctrl.openModal}
      >
        <ArrowUpTrayIcon class="w-5 h-5 text-inherit" />
      </button>
      <Modal openSignal={ctrl.state.open}>
        <form {...ctrl.form.props} class="modal-box">
          <h3 class="font-bold text-lg">Upload File</h3>
          <div class="form-control w-full max-w-xs">
            <input
              type="text"
              placeholder="Suggested File Name"
              name="fileName"
              class="input input-bordered w-full max-w-xs mt-2"
              value={ctrl.form.state.fileName.value}
              onInput={ctrl.form.handleInput}
              required
            />
            <label class="label">
              <span class="label-text-alt">
                The file name suggested when the file is downloaded
              </span>
            </label>
          </div>

          <SubmitCancel class="modal-action" onCancel={ctrl.cancel} />
        </form>
      </Modal>
    </>
  );
}

export class UploadInserterController extends ArticleEditToolController {
  _defineState() {
    return {
      fileName: { value: "", cache: true },
    };
  }

  async buildInsertionText({ fileName }) {
    const file = await window.api.selectUploadFile();

    const upload = await window.api.createUpload({
      fileName,
      file,
      dbId: this.parentController.props.dbId,
    });

    return `<eduba-upload publisher="${upload.dbId}" upload="${upload.id}"></eduba-upload>`;
  }
}
