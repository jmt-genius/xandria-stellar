import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
if (typeof window !== "undefined") {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const networks = {
    testnet: {
        networkPassphrase: "Test SDF Network ; September 2015",
        contractId: "CCK3XSWGFOAH2K6OLQYFDHS2OR62TMZ3YESFAF2LDD7RS76I6CPO7GKK",
    }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy(null, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAAAQAAAAAAAAAAAAAAA1RpcAAAAAAEAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAB21lc3NhZ2UAAAAAEAAAAAAAAAAGc2VuZGVyAAAAAAATAAAAAAAAAAl0aW1lc3RhbXAAAAAAAAAG",
            "AAAAAQAAAAAAAAAAAAAABEJvb2sAAAAKAAAAAAAAAAZhdXRob3IAAAAAABAAAAAAAAAADmF1dGhvcl9hZGRyZXNzAAAAAAATAAAAAAAAAAhib29rX3VyaQAAABAAAAAAAAAACWNvdmVyX3VyaQAAAAAAABAAAAAAAAAAC2Rlc2NyaXB0aW9uAAAAABAAAAAAAAAACmlzX3NwZWNpYWwAAAAAAAEAAAAAAAAABXByaWNlAAAAAAAACwAAAAAAAAAQcmVtYWluaW5nX3N1cHBseQAAAAQAAAAAAAAABXRpdGxlAAAAAAAAEAAAAAAAAAAMdG90YWxfc3VwcGx5AAAABA==",
            "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABQAAAAAAAAAAAAAABUFkbWluAAAAAAAAAQAAAAAAAAAEQm9vawAAAAEAAAAEAAAAAAAAAAAAAAAOVG9rZW5JZENvdW50ZXIAAAAAAAEAAAAAAAAACFB1cmNoYXNlAAAAAgAAABMAAAAEAAAAAQAAAAAAAAAEVGlwcwAAAAEAAAAE",
            "AAAAAAAAAAAAAAAIYnV5X2Jvb2sAAAADAAAAAAAAAAVidXllcgAAAAAAABMAAAAAAAAAB2Jvb2tfaWQAAAAABAAAAAAAAAANdG9rZW5fYWRkcmVzcwAAAAAAABMAAAAA",
            "AAAAAAAAAAAAAAAIZ2V0X2Jvb2sAAAABAAAAAAAAAAdib29rX2lkAAAAAAQAAAABAAAD6AAAB9AAAAAEQm9vaw==",
            "AAAAAAAAAAAAAAAIZ2V0X3RpcHMAAAABAAAAAAAAAAdib29rX2lkAAAAAAQAAAABAAAD6gAAB9AAAAADVGlwAA==",
            "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAQAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAA==",
            "AAAAAAAAAAAAAAAKdGlwX2F1dGhvcgAAAAAABQAAAAAAAAAGc2VuZGVyAAAAAAATAAAAAAAAAAdib29rX2lkAAAAAAQAAAAAAAAABmFtb3VudAAAAAAACwAAAAAAAAAHbWVzc2FnZQAAAAAQAAAAAAAAAA10b2tlbl9hZGRyZXNzAAAAAAAAEwAAAAA=",
            "AAAAAAAAAAAAAAAMcHVibGlzaF9ib29rAAAACQAAAAAAAAAGYXV0aG9yAAAAAAATAAAAAAAAAAV0aXRsZQAAAAAAABAAAAAAAAAAC2F1dGhvcl9uYW1lAAAAABAAAAAAAAAAC2Rlc2NyaXB0aW9uAAAAABAAAAAAAAAABXByaWNlAAAAAAAACwAAAAAAAAAJY292ZXJfdXJpAAAAAAAAEAAAAAAAAAAIYm9va191cmkAAAAQAAAAAAAAAAppc19zcGVjaWFsAAAAAAABAAAAAAAAAAZzdXBwbHkAAAAAAAQAAAABAAAABA==",
            "AAAAAAAAAAAAAAANaGFzX3B1cmNoYXNlZAAAAAAAAAIAAAAAAAAABWJ1eWVyAAAAAAAAEwAAAAAAAAAHYm9va19pZAAAAAAEAAAAAQAAAAE="]), options);
        this.options = options;
    }
    fromJSON = {
        buy_book: (this.txFromJSON),
        get_book: (this.txFromJSON),
        get_tips: (this.txFromJSON),
        initialize: (this.txFromJSON),
        tip_author: (this.txFromJSON),
        publish_book: (this.txFromJSON),
        has_purchased: (this.txFromJSON)
    };
}
