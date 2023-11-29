import { h } from "preact";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { SignalStateModel } from "../lib/signal-state-model";
import { useController } from "../hooks/use-controller.hook";
import { Alert } from "../events";

export default function Alerts() {
  const ctrl = useController(AlertsController);

  return (
    <div class="toast toast-center">
      {ctrl.state.alerts.value.map((alert) => {
        let actionBtn = false;

        if (alert.action) {
          actionBtn = (
            <button class="btn btn-ghost" onClick={alert.action.handler}>
              {alert.action.label}
            </button>
          );
        } else if (!alert.timeout) {
          actionBtn = (
            <button
              class="btn btn-circle btn-ghost"
              onClick={() => ctrl.removeAlert(alert)}
            >
              <XMarkIcon class="x-4 h-4 text-inherit" />
            </button>
          );
        }

        return (
          <div key={alert.message} class={`alert ${alert.type}`}>
            <span>{alert.message}</span>
            {actionBtn}
          </div>
        );
      })}
    </div>
  );
}

export class AlertsController extends SignalStateModel {
  constructor(spec) {
    super({
      state: {
        alerts: { value: [] },
      },
    });

    this.events = spec.events;
  }

  async initialize() {
    await super.initialize();
    this.events.on(Alert, this.createAlert);
  }

  destroy() {
    super.destroy();
    this.events.off(Alert, this.createAlert);
  }

  createAlert = (alert) => {
    if (alert.timeout) {
      setTimeout(() => this.removeAlert(alert), alert.timeout);
    }
    if (alert.action) {
      const { handler } = alert.action;
      alert.action.handler = () => {
        handler();
        this.removeAlert(alert);
      };
    }
    this.setState({ alerts: [...this.state.alerts.peek(), alert] });
  };

  removeAlert(alert) {
    this.setState({
      alerts: this.state.alerts.peek().filter((a) => a !== alert),
    });
  }
}
