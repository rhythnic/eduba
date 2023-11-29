import { h } from "preact";
import { styles } from "../lib/utils";

export default function TextField({
  label,
  bottomLabel,
  class: className = "",
  type = "text",
  ...inputProps
}) {
  return (
    <div
      class={styles({
        [className]: !!className,
        "form-control w-full": true,
      })}
    >
      <label class="label">
        <span class="label-text">{label}</span>
      </label>
      <input
        {...inputProps}
        type={type}
        class="input input-bordered w-full invalid:input-error"
      />
      {!!bottomLabel && (
        <label className="label">
          <span className="label-text-alt">{bottomLabel}</span>
        </label>
      )}
    </div>
  );
}
