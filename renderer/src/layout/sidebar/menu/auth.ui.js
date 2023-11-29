import { h } from "preact";
import Modal from "../../../components/modal.ui";
import TextField from "../../../components/text-field.ui";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { useController } from "../../../hooks/use-controller.hook";
import { AuthController } from "./auth.controller";
import SubmitCancel from "../../../components/submit-cancel.ui";

export default function Auth() {
  const ctrl = useController(AuthController);

  return (
    <>
      <Modal openSignal={ctrl.state.modal}>
        <form {...ctrl.form.props} class="modal-box w-11/12 max-w-3xl">
          <fieldset>
            <legend>Method of Sign In</legend>
            <div class="flex flex-wrap">
              <div className="form-control flex-1">
                <label className="label cursor-pointer justify-start">
                  <input
                    type="radio"
                    name="walletType"
                    value="mneumonic"
                    className="radio checked:bg-blue-500 mr-4"
                    checked={ctrl.form.state.walletType.value === "mneumonic"}
                    onInput={ctrl.form.handleInput}
                  />
                  <span className="label-text">Recovery Phrase</span>
                </label>
              </div>
              <div className="form-control flex-1">
                <label className="label cursor-pointer justify-start">
                  <input
                    type="radio"
                    name="walletType"
                    value="ledger"
                    className="radio checked:bg-blue-500 mr-4"
                    checked={ctrl.form.state.walletType.value === "ledger"}
                    onInput={ctrl.form.handleInput}
                  />
                  <span className="label-text">Ledger Hardware Wallet</span>
                </label>
              </div>
            </div>
            {ctrl.form.state.walletType.value === "mneumonic" && (
              <div>
                <div class="flex items-center">
                  <TextField
                    class="mr-2 w-11/12"
                    label="Recovery Phrase"
                    bottomLabel="Save this phrase somewhere safe, such as a password manager."
                    value={ctrl.form.state.phrase.value}
                    onInput={ctrl.form.handleInput}
                    name="phrase"
                    required
                  />
                  <button
                    type="button"
                    class="btn btn-primary btn-circle"
                    title="Generate recovery phrase"
                    onClick={ctrl.generateMneumonic}
                  >
                    <ArrowPathIcon class="w-6 h-6 text-inherit" />
                  </button>
                </div>
              </div>
            )}
          </fieldset>

          <div className="collapse bg-base-200 mt-4">
            <input type="radio" name="auth-options" />
            <div className="collapse-title text-xl font-medium">
              Advanced Options
            </div>
            <div className="collapse-content">
              <fieldset>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Blockchain</span>
                  </label>
                  <select
                    class="select w-full max-w-xs"
                    name="chain"
                    value={ctrl.form.state.chain.value}
                    onInput={ctrl.form.handleInput}
                    required
                  >
                    <option value="0">Bitcoin</option>
                    <option value="60">Ethereum</option>
                  </select>
                </div>

                <TextField
                  type="number"
                  label="Account"
                  bottomLabel="Group of addresses"
                  value={ctrl.form.state.account.value}
                  onInput={ctrl.form.handleInput}
                  name="account"
                  required
                />
                {ctrl.form.state.chain.value === "0" && (
                  <TextField
                    type="number"
                    label="Change"
                    value={ctrl.form.state.change.value}
                    onInput={ctrl.form.handleInput}
                    name="change"
                    required
                  />
                )}
                <TextField
                  type="number"
                  label="Address Index"
                  bottomLabel="Index of address within the account group"
                  value={ctrl.form.state.index.value}
                  onInput={ctrl.form.handleInput}
                  name="index"
                  required
                />
                <div class="mt-2 flex flex-wrap">
                  <span class="mr-2">Address:</span>
                  <p class="break-all">{ctrl.state.address.value}</p>
                </div>
              </fieldset>
            </div>
          </div>

          <SubmitCancel class="modal-action" onCancel={ctrl.closeModal} />
        </form>
      </Modal>

      <button onClick={ctrl.openModal} class="btn btn-primary block">
        Sign In
      </button>
    </>
  );
}
