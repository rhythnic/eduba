import { h } from "preact";
import TextField from "../../components/text-field.ui";
import SubmitCancel from "../../components/submit-cancel.ui";
import WarningModal from "../../components/warning-modal.ui";
import ArticleViewer from "../../components/article-viewer.ui";
import { useController } from "../../hooks/use-controller.hook";
import {
  ArticleEditPageContext,
  ArticleEditPageController,
} from "./article-edit-page.controller";
import { useSignalEffect } from "@preact/signals";
import ArticleLinkInserter from "./tools/article-link-inserter.ui";
import AudioInserter from "./tools/audio-inserter.ui";
import VideoInserter from "./tools/video-inserter.ui";
import ImageInserter from "./tools/image-inserter.ui";
import Uploader from "./tools/upload-inserter.ui";

export default function ArticleEditPage(props) {
  const ctrl = useController(ArticleEditPageController, props, [props.pageId]);

  useSignalEffect(() => {
    ctrl.setTextarea(ctrl.form.state.markdown.value);
  });

  return (
    <ArticleEditPageContext.Provider value={ctrl}>
      <main class="page" key={props.pageId}>
        <form
          id="article-form"
          {...ctrl.form.props}
          class="h-full flex flex-col"
        >
          <div class="flex justify-end items-center">
            <SubmitCancel
              onCancel={ctrl.cancelEdit}
              submitLabel="Publish"
              cancelLabel="Cancel"
            />
          </div>
          <div class="flex flex-wrap flex-1 p-1">
            <div class="flex flex-col bg-base-200 basis-96 grow shrink-0 p-4 m-1">
              <div class="mb-1">
                <TextField
                  class="w-full"
                  label="Title"
                  value={ctrl.form.state.title.value}
                  onInput={ctrl.form.handleInput}
                  name="title"
                  required
                />
              </div>
              <div class="flex-1 flex flex-col">
                <div class="join mb-1">
                  <ArticleLinkInserter />
                  <ImageInserter />
                  <AudioInserter />
                  <VideoInserter />
                  <Uploader />
                </div>
                <textarea
                  ref={ctrl.textarea}
                  name="markdown"
                  class="textarea w-full h-full"
                  onChange={ctrl.form.handleInput}
                  rows="20"
                  tabIndex={props.tabIndex || 0}
                ></textarea>
              </div>
            </div>
            <div class="bg-base-300 basis-96 grow shrink-0 p-4 m-1">
              <ArticleViewer
                markdown={ctrl.displayMarkdown}
                cacheMedia={true}
              />
            </div>
          </div>
        </form>
        <WarningModal warning={ctrl.state.warning} />
      </main>
    </ArticleEditPageContext.Provider>
  );
}
