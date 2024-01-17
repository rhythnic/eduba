import { HdWalletParams, HdWalletSignMessageParams } from "../types";
import { HdWalletBase } from "./hd-wallet.base";

export class LedgerHdWalletBase extends HdWalletBase {
    public addressForPath(request: HdWalletParams): Promise<string>{
        throw new Error("Not Implemented");
    }

    public signMessage(request: HdWalletSignMessageParams): Promise<string> {
        throw new Error("Not Implemented");
    }
}
