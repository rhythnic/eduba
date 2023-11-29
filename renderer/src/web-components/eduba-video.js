import register from "preact-custom-element";
import { Component, h } from "preact";

export class EdubaVideo extends Component {
  state = {
    video: null,
  };

  async componentDidMount() {
    this.removeVideoListener = window.publicEvents.onVideoChanged(
      async (evt) => {
        const { props } = this;
        if (
          evt.type !== "delete" &&
          evt.dbId === props.publisher &&
          evt.id === props.video
        ) {
          const video = await window.api.getVideo(evt.dbId, evt.id);
          this.setState({ video });
        }
      }
    );

    const { publisher: publisherId, video: videoId } = this.props;
    const video = await window.api.getVideo(publisherId, videoId);
    this.setState({ video });
  }

  componentWillUnmount() {
    this.removeVideoListener();
  }

  render(props, state) {
    if (!state.video) return;

    const src = `eduba://${state.video.dbId}/files/video/${state.video.id}${state.video.ext}`;

    const videoEl = (
      <video controls>
        <source src={src} type={state.video.type} />
        <a href={src} download>
          Download {state.video.title}
        </a>
      </video>
    );

    return (
      <figure>
        {videoEl}
        <figcaption>
          {state.video.title} - {props.caption}
        </figcaption>
      </figure>
    );
  }
}

const observedAttributes = [];

register(EdubaVideo, "eduba-video", observedAttributes, {
  shadow: false,
});
