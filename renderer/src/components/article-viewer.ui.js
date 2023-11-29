import { h } from "preact";
import Markdown from "preact-markdown";
import { createRef } from "preact";
import { useController } from "../hooks/use-controller.hook";

export default function ArticleViewer(props) {
  const ctrl = useController(ArticleController, props);

  return (
    <article ref={ctrl.article}>
      <Markdown markdown={props.markdown.value || ""} />
    </article>
  );
}

export class ArticleController {
  constructor(spec) {
    this.appStore = spec.appStore;
    this.navStore = spec.navStore;
    this.article = createRef();
    this.articleLinkRgx = /^\/?([0-9a-z]{52})\/articles\/([0-9a-z]+)$/i;
  }

  initialize() {
    this.article.current.addEventListener("click", this.interceptLink);
  }

  destroy() {
    this.article.current.removeEventListener("click", this.interceptLink);
  }

  interceptLink = async (evt) => {
    try {
      const target = evt.target || evt.srcElement;

      // Return is evt target is not a link.
      if (target.tagName !== "A") return;

      let href = target.getAttribute("href");

      // Force http links to open in the user's default browser
      if (href.startsWith("http")) {
        target.setAttribute("target", "_blank");
        return;
      }

      // Allow main to handle downloads
      if (target.hasAttribute("download")) {
        return;
      }

      // Prevent default handling of any non-http links
      evt.preventDefault();

      if (this.articleLinkRgx.test(href)) {
        // Open article in same tab
        href = href.startsWith("/") ? href.slice(1) : href;
        this.navStore.insertPage({ href }, false);
        return;
      }
    } catch (err) {
      this.appStore.reportError(err);
    }
  };
}
