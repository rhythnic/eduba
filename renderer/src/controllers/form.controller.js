import { createRef } from "preact";
import { SignalStateModel } from "../lib/signal-state-model";

export class FormController extends SignalStateModel {
  constructor(spec) {
    super(spec);

    this.onSubmit = spec.onSubmit;

    this.element = createRef();

    this.props = {
      onSubmit: this.handleSubmit,
      ref: this.element,
      method: "dialog",
    };
  }

  handleInput = (evt) => {
    let { name, value } = evt.target;

    if (!this.state[name]) {
      console.error(`Unknown form field: ${name}`);
    } else {
      if (evt.target.getAttribute("type") === "number") {
        value = Number(value);
      }
      this.setState({ [name]: value });
    }
  };

  handleSubmit = async (evt) => {
    evt.preventDefault();
    if (!this.validate()) return;
    if (typeof this.onSubmit === "function") {
      const result = {};
      for (const key in this.state) {
        result[key] = this.state[key].value;
      }
      this.onSubmit(result);
    }
  };

  ignoreEnterKey = (evt) => {
    const code = evt.charCode || evt.keyCode || 0;
    if (code === 13 && evt.target.tagName !== "TEXTAREA") {
      evt.preventDefault();
    }
  };

  validate() {
    return this.element.current.reportValidity();
  }
}
