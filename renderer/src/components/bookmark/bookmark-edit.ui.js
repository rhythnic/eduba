import { h } from "preact";
import { useSignalEffect } from "@preact/signals";
import Modal from "../modal.ui";
import TextField from "../text-field.ui";
import { SignalStateModel } from "../../lib/signal-state-model";
import { FormController } from "../../controllers/form.controller";
import { useController } from "../../hooks/use-controller.hook";
import { Alert } from "../../events";
import { AlertType } from "../../enums";
import SubmitCancel from "../submit-cancel.ui";

export default function BookmarkEdit(props) {
  const ctrl = useController(BookmarkEditController, props);
  const { bookmarkSignal, disableHrefEdit } = props;

  useSignalEffect(() => {
    ctrl.initialize(bookmarkSignal.value);
  });

  const isFolder =
    bookmarkSignal.value && bookmarkSignal.value.type === "folder";
  const heading = isFolder ? "Folder" : "Bookmark";

  return (
    <Modal openSignal={bookmarkSignal}>
      <div class="modal-box w-full max-w-3xl">
        <h3 class="font-bold text-lg">{heading}</h3>
        <form
          id="add-bookmark-form"
          {...ctrl.form.props}
          class="h-full flex flex-col"
        >
          <TextField
            class="w-full"
            label="Title"
            value={ctrl.form.state.title.value}
            onInput={ctrl.form.handleInput}
            name="title"
            required
          />
          {!isFolder && (
            <TextField
              class="w-full"
              label="<Publisher ID>/articles/<Article ID>"
              value={ctrl.form.state.href.value}
              onInput={ctrl.form.handleInput}
              name="href"
              required
              disabled={disableHrefEdit === true}
            />
          )}
          <SubmitCancel class="modal-action" onCancel={ctrl.cancel} />
        </form>
      </div>
    </Modal>
  );
}

export class BookmarkEditController extends SignalStateModel {
  constructor(spec) {
    super(spec);

    this.events = spec.events;
    this.appStore = spec.appStore;
    this.bookmarkStore = spec.bookmarkStore;

    this.form = new FormController({
      storage: this.sub("form", { cache: true }),
      onSubmit: this.saveBookmark,
      state: {
        href: { value: "" },
        title: { value: "" },
      },
    });
  }

  async initialize(bookmark) {
    await super.initialize();
    await this.form.initialize();

    this.bookmark = bookmark;
    const { href = "", title = "" } = bookmark || {};
    this.form.setState({ href, title });
  }

  saveBookmark = async (bookmark) => {
    try {
      bookmark = Object.assign({}, this.bookmark, bookmark);
      if (!bookmark.title) delete bookmark.title;
      if (!bookmark.href) delete bookmark.href;

      if (bookmark.id) {
        bookmark = await this.bookmarkStore.updateBookmark(bookmark);
      } else {
        bookmark = await this.bookmarkStore.createBookmark(bookmark);
      }

      this.events.emit(Alert, {
        type: AlertType.Info,
        message: "Bookmark Saved",
        timeout: 3000,
      });

      this.props.onDone(bookmark);
    } catch (err) {
      this.appStore.reportError(err);
    }
  };

  cancel = () => {
    this.onDone();
  };
}
