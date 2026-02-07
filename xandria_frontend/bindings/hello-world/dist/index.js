import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
if (typeof window !== "undefined") {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy(null, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAAAQAAAAAAAAAAAAAABEJvb2sAAAAJAAAAAAAAAAZhdXRob3IAAAAAABAAAAAAAAAADmF1dGhvcl9hZGRyZXNzAAAAAAATAAAAAAAAAAhib29rX3VyaQAAABAAAAAAAAAACWNvdmVyX3VyaQAAAAAAABAAAAAAAAAACmlzX3NwZWNpYWwAAAAAAAEAAAAAAAAABXByaWNlAAAAAAAACwAAAAAAAAAQcmVtYWluaW5nX3N1cHBseQAAAAQAAAAAAAAABXRpdGxlAAAAAAAAEAAAAAAAAAAMdG90YWxfc3VwcGx5AAAABA==",
            "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAgAAAAEAAAAAAAAABEJvb2sAAAABAAAABAAAAAAAAAAAAAAADlRva2VuSWRDb3VudGVyAAA=",
            "AAAAAAAAAAAAAAAIYnV5X2Jvb2sAAAADAAAAAAAAAAVidXllcgAAAAAAABMAAAAAAAAAB2Jvb2tfaWQAAAAABAAAAAAAAAANdG9rZW5fYWRkcmVzcwAAAAAAABMAAAAA",
            "AAAAAAAAAAAAAAAIZ2V0X2Jvb2sAAAABAAAAAAAAAAdib29rX2lkAAAAAAQAAAABAAAD6AAAB9AAAAAEQm9vaw==",
            "AAAAAAAAAAAAAAAMcHVibGlzaF9ib29rAAAACAAAAAAAAAAGYXV0aG9yAAAAAAATAAAAAAAAAAV0aXRsZQAAAAAAABAAAAAAAAAAC2F1dGhvcl9uYW1lAAAAABAAAAAAAAAABXByaWNlAAAAAAAACwAAAAAAAAAJY292ZXJfdXJpAAAAAAAAEAAAAAAAAAAIYm9va191cmkAAAAQAAAAAAAAAAppc19zcGVjaWFsAAAAAAABAAAAAAAAAAZzdXBwbHkAAAAAAAQAAAABAAAABA=="]), options);
        this.options = options;
    }
    fromJSON = {
        buy_book: (this.txFromJSON),
        get_book: (this.txFromJSON),
        publish_book: (this.txFromJSON)
    };
}
