import { DbChangeType } from "@/lib/holepunch";

export class UploadChangeEvent {
    constructor(
        public readonly type: DbChangeType,
        public readonly db: string,
        public readonly id: string
    ){}
}
