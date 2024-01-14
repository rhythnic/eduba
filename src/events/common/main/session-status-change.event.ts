import { SessionStatus } from "@/enums";

export class SessionStatusChangeEvent {
    constructor(public readonly status: SessionStatus){}
}
