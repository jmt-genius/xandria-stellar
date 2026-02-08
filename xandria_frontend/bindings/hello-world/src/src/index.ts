import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
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
} as const


export interface Tip {
  amount: i128;
  message: string;
  sender: string;
  timestamp: u64;
}


export interface Book {
  author: string;
  author_address: string;
  book_uri: string;
  cover_uri: string;
  description: string;
  is_special: boolean;
  price: i128;
  remaining_supply: u32;
  title: string;
  total_supply: u32;
}

export type DataKey = {tag: "Admin", values: void} | {tag: "Book", values: readonly [u32]} | {tag: "TokenIdCounter", values: void} | {tag: "Purchase", values: readonly [string, u32]} | {tag: "Tips", values: readonly [u32]};

export interface Client {
  /**
   * Construct and simulate a buy_book transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  buy_book: ({buyer, book_id, token_address}: {buyer: string, book_id: u32, token_address: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_book transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_book: ({book_id}: {book_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<Option<Book>>>

  /**
   * Construct and simulate a get_tips transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_tips: ({book_id}: {book_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<Array<Tip>>>

  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize: ({admin}: {admin: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a tip_author transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  tip_author: ({sender, book_id, amount, message, token_address}: {sender: string, book_id: u32, amount: i128, message: string, token_address: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a publish_book transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  publish_book: ({author, title, author_name, description, price, cover_uri, book_uri, is_special, supply}: {author: string, title: string, author_name: string, description: string, price: i128, cover_uri: string, book_uri: string, is_special: boolean, supply: u32}, options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a has_purchased transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  has_purchased: ({buyer, book_id}: {buyer: string, book_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<boolean>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAQAAAAAAAAAAAAAAA1RpcAAAAAAEAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAB21lc3NhZ2UAAAAAEAAAAAAAAAAGc2VuZGVyAAAAAAATAAAAAAAAAAl0aW1lc3RhbXAAAAAAAAAG",
        "AAAAAQAAAAAAAAAAAAAABEJvb2sAAAAKAAAAAAAAAAZhdXRob3IAAAAAABAAAAAAAAAADmF1dGhvcl9hZGRyZXNzAAAAAAATAAAAAAAAAAhib29rX3VyaQAAABAAAAAAAAAACWNvdmVyX3VyaQAAAAAAABAAAAAAAAAAC2Rlc2NyaXB0aW9uAAAAABAAAAAAAAAACmlzX3NwZWNpYWwAAAAAAAEAAAAAAAAABXByaWNlAAAAAAAACwAAAAAAAAAQcmVtYWluaW5nX3N1cHBseQAAAAQAAAAAAAAABXRpdGxlAAAAAAAAEAAAAAAAAAAMdG90YWxfc3VwcGx5AAAABA==",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABQAAAAAAAAAAAAAABUFkbWluAAAAAAAAAQAAAAAAAAAEQm9vawAAAAEAAAAEAAAAAAAAAAAAAAAOVG9rZW5JZENvdW50ZXIAAAAAAAEAAAAAAAAACFB1cmNoYXNlAAAAAgAAABMAAAAEAAAAAQAAAAAAAAAEVGlwcwAAAAEAAAAE",
        "AAAAAAAAAAAAAAAIYnV5X2Jvb2sAAAADAAAAAAAAAAVidXllcgAAAAAAABMAAAAAAAAAB2Jvb2tfaWQAAAAABAAAAAAAAAANdG9rZW5fYWRkcmVzcwAAAAAAABMAAAAA",
        "AAAAAAAAAAAAAAAIZ2V0X2Jvb2sAAAABAAAAAAAAAAdib29rX2lkAAAAAAQAAAABAAAD6AAAB9AAAAAEQm9vaw==",
        "AAAAAAAAAAAAAAAIZ2V0X3RpcHMAAAABAAAAAAAAAAdib29rX2lkAAAAAAQAAAABAAAD6gAAB9AAAAADVGlwAA==",
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAQAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAA==",
        "AAAAAAAAAAAAAAAKdGlwX2F1dGhvcgAAAAAABQAAAAAAAAAGc2VuZGVyAAAAAAATAAAAAAAAAAdib29rX2lkAAAAAAQAAAAAAAAABmFtb3VudAAAAAAACwAAAAAAAAAHbWVzc2FnZQAAAAAQAAAAAAAAAA10b2tlbl9hZGRyZXNzAAAAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAMcHVibGlzaF9ib29rAAAACQAAAAAAAAAGYXV0aG9yAAAAAAATAAAAAAAAAAV0aXRsZQAAAAAAABAAAAAAAAAAC2F1dGhvcl9uYW1lAAAAABAAAAAAAAAAC2Rlc2NyaXB0aW9uAAAAABAAAAAAAAAABXByaWNlAAAAAAAACwAAAAAAAAAJY292ZXJfdXJpAAAAAAAAEAAAAAAAAAAIYm9va191cmkAAAAQAAAAAAAAAAppc19zcGVjaWFsAAAAAAABAAAAAAAAAAZzdXBwbHkAAAAAAAQAAAABAAAABA==",
        "AAAAAAAAAAAAAAANaGFzX3B1cmNoYXNlZAAAAAAAAAIAAAAAAAAABWJ1eWVyAAAAAAAAEwAAAAAAAAAHYm9va19pZAAAAAAEAAAAAQAAAAE=" ]),
      options
    )
  }
  public readonly fromJSON = {
    buy_book: this.txFromJSON<null>,
        get_book: this.txFromJSON<Option<Book>>,
        get_tips: this.txFromJSON<Array<Tip>>,
        initialize: this.txFromJSON<null>,
        tip_author: this.txFromJSON<null>,
        publish_book: this.txFromJSON<u32>,
        has_purchased: this.txFromJSON<boolean>
  }
}