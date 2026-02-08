import { Buffer } from "buffer";
import { AssembledTransaction, Client as ContractClient, ClientOptions as ContractClientOptions, MethodOptions } from "@stellar/stellar-sdk/contract";
import type { u32, i128, Option } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
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
export type DataKey = {
    tag: "Admin";
    values: void;
} | {
    tag: "Book";
    values: readonly [u32];
} | {
    tag: "TokenIdCounter";
    values: void;
} | {
    tag: "Purchase";
    values: readonly [string, u32];
};
export interface Client {
    /**
     * Construct and simulate a buy_book transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    buy_book: ({ buyer, book_id, token_address }: {
        buyer: string;
        book_id: u32;
        token_address: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a get_book transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    get_book: ({ book_id }: {
        book_id: u32;
    }, options?: MethodOptions) => Promise<AssembledTransaction<Option<Book>>>;
    /**
     * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    initialize: ({ admin }: {
        admin: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a publish_book transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    publish_book: ({ author, title, author_name, description, price, cover_uri, book_uri, is_special, supply }: {
        author: string;
        title: string;
        author_name: string;
        description: string;
        price: i128;
        cover_uri: string;
        book_uri: string;
        is_special: boolean;
        supply: u32;
    }, options?: MethodOptions) => Promise<AssembledTransaction<u32>>;
    /**
     * Construct and simulate a has_purchased transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    has_purchased: ({ buyer, book_id }: {
        buyer: string;
        book_id: u32;
    }, options?: MethodOptions) => Promise<AssembledTransaction<boolean>>;
}
export declare class Client extends ContractClient {
    readonly options: ContractClientOptions;
    static deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions & Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
    }): Promise<AssembledTransaction<T>>;
    constructor(options: ContractClientOptions);
    readonly fromJSON: {
        buy_book: (json: string) => AssembledTransaction<null>;
        get_book: (json: string) => AssembledTransaction<Option<Book>>;
        initialize: (json: string) => AssembledTransaction<null>;
        publish_book: (json: string) => AssembledTransaction<number>;
        has_purchased: (json: string) => AssembledTransaction<boolean>;
    };
}
