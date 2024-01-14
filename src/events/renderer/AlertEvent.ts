import { AlertType } from "@/enums";

export interface AlertAction {
    label: string;
    handler: () => void;
}

export class AlertEvent {
    type: AlertType;
    message: string;
    timeout?: number;
    action?: AlertAction;

    constructor(init: Partial<AlertEvent>) {
        Object.assign(this, init);
    }
}