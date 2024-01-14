import { DbChangeType } from "@/lib/holepunch";

export class UserPublisherChangeEvent {
    constructor(
        public readonly type: DbChangeType,
        public readonly db: string,
        public readonly id: string
    ){}
}
