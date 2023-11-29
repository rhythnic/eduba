import register from "preact-custom-element";
import { Component, h } from "preact";

export class EdubaArticle extends Component {
  state = {
    article: null,
  };

  async componentDidMount() {
    this.removeArticleListener = window.publicEvents.onArticleChanged(
      async (evt) => {
        const { props } = this;
        if (evt.dbId === props.publisher && evt.id === props.article) {
          const article = await window.api.getAritcle(evt.dbId, evt.id);
          this.setState({ article });
        }
      }
    );

    const { publisher: publisherId, article: articleId } = this.props;
    const article = await window.api.getArticle(publisherId, articleId);
    this.setState({ article });
  }

  componentWillUnmount() {
    this.removeArticleListener();
  }

  render(props, state) {
    const label = props.label || (state.article && state.article.title);
    return <a href={`${props.publisher}/articles/${props.article}`}>{label}</a>;
  }
}

const observedAttributes = [];

register(EdubaArticle, "eduba-article", observedAttributes, {
  shadow: false,
});
