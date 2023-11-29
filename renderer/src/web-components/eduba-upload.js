import register from "preact-custom-element";
import { Component, h } from "preact";

export class EdubaUpload extends Component {
  state = {
    upload: null,
  };

  async componentDidMount() {
    this.removeUploadListener = window.publicEvents.onUploadChanged(
      async (evt) => {
        const { props } = this;
        if (evt.dbId === props.publisher && evt.id === props.upload) {
          const upload = await window.api.getUpload(evt.dbId, evt.id);
          this.setState({ upload });
        }
      }
    );

    const { publisher: publisherId, upload: uploadId } = this.props;
    const upload = await window.api.getUpload(publisherId, uploadId);
    this.setState({ upload });
  }

  componentWillUnmount() {
    this.removeUploadListener();
  }

  render(props, state) {
    const { upload } = state;

    if (!upload) return;

    const label = upload.name || upload.fileName;

    return (
      <a
        class="btn"
        href={`eduba://${upload.dbId}/files/uploads/${upload.id}`}
        download
      >
        Download {label}
      </a>
    );
  }
}

const observedAttributes = [];

register(EdubaUpload, "eduba-upload", observedAttributes, {
  shadow: false,
});
