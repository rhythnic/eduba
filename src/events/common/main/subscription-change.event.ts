import { DbChangeType } from "@/lib/holepunch";

export class SubscriptionChangeEvent {
    constructor(
        public readonly type: DbChangeType,
        public readonly db: string,
        public readonly id: string
    ){}
}
