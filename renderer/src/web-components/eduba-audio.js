import register from "preact-custom-element";
import { Component, h } from "preact";

export class EdubaAudio extends Component {
  state = {
    audio: null,
  };

  async componentDidMount() {
    this.removeAudioListener = window.publicEvents.onAudioChanged(
      async (evt) => {
        const { props } = this;
        if (
          evt.type !== "delete" &&
          evt.dbId === props.publisher &&
          evt.id === props.audio
        ) {
          const audio = await window.api.getAudio(evt.dbId, evt.id);
          this.setState({ audio });
        }
      }
    );

    const { publisher: publisherId, audio: audioId } = this.props;
    const audio = await window.api.getAudio(publisherId, audioId);
    this.setState({ audio });
  }

  componentWillUnmount() {
    this.removeAudioListener();
  }

  render(props, state) {
    if (!state.audio) return;

    const src = `eduba://${state.audio.dbId}/files/audio/${state.audio.id}${state.audio.ext}`;

    const audioEl = (
      <audio controls>
        <source src={src} type={state.audio.type} />
        <a href={src} download>
          Download {state.audio.title}
        </a>
      </audio>
    );

    return (
      <figure>
        {audioEl}
        <figcaption>
          {state.audio.title} - {props.caption}
        </figcaption>
      </figure>
    );
  }
}

const observedAttributes = [];

register(EdubaAudio, "eduba-audio", observedAttributes, {
  shadow: false,
});
