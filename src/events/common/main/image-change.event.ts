import { DbChangeType } from "@/lib/holepunch";

export class ImageChangeEvent {
    constructor(
        public readonly type: DbChangeType,
        public readonly db: string,
        public readonly id: string
    ){}
}
