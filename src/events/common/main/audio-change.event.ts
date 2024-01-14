import { DbChangeType } from "@/lib/holepunch";

export class AudioChangeEvent {
    constructor(
        public readonly type: DbChangeType,
        public readonly db: string,
        public readonly id: string
    ){}
}
