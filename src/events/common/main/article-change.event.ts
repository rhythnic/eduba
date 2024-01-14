import { DbChangeType } from "@/lib/holepunch";

export class ArticleChangeEvent {
    constructor(
        public readonly type: DbChangeType,
        public readonly db: string,
        public readonly id: string
    ){}
}
