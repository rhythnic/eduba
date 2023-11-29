import register from "preact-custom-element";
import { Component, h } from "preact";

export class EdubaImage extends Component {
  state = {
    image: null,
  };

  async componentDidMount() {
    this.removeImageListener = window.publicEvents.onImageChanged(
      async (evt) => {
        const { props } = this;
        if (
          evt.type !== "delete" &&
          evt.dbId === props.publisher &&
          evt.id === props.image
        ) {
          const image = await window.api.getImage(evt.dbId, evt.id);
          this.setState({ image });
        }
      }
    );

    const { publisher: publisherId, image: imageId } = this.props;
    const image = await window.api.getImage(publisherId, imageId);
    this.setState({ image });
  }

  componentWillUnmount() {
    this.removeImageListener();
  }

  render(props, state) {
    if (!state.image) return;

    const imageEl = (
      <img
        src={`eduba://${state.image.dbId}/files/images/${state.image.id}${state.image.ext}`}
        alt={state.image.alt}
        title={props.title}
      />
    );

    if (props.caption) {
      return (
        <figure>
          {imageEl}
          <figcaption>{props.caption}</figcaption>
        </figure>
      );
    }

    return imageEl;
  }
}

const observedAttributes = [];

register(EdubaImage, "eduba-image", observedAttributes, {
  shadow: false,
});
