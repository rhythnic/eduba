import { DbChangeType } from "@/lib/holepunch";

export class VideoChangeEvent {
    constructor(
        public readonly type: DbChangeType,
        public readonly db: string,
        public readonly id: string
    ){}
}
