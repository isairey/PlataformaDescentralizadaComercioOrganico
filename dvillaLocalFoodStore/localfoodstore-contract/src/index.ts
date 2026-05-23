import * as SorobanClient from "soroban-client";
import { ContractSpec, Address } from "soroban-client";
import { Buffer } from "buffer";
import { invoke } from "./invoke.js";
import type { ResponseTypes, Wallet, ClassOptions } from "./method-options.js";

export * from "./invoke.js";
export * from "./method-options.js";

export type u32 = number;
export type i32 = number;
export type u64 = bigint;
export type i64 = bigint;
export type u128 = bigint;
export type i128 = bigint;
export type u256 = bigint;
export type i256 = bigint;
export type Option<T> = T | undefined;
export type Typepoint = bigint;
export type Duration = bigint;
export { Address };

/// Error interface containing the error message
export interface Error_ {
  message: string;
}

export interface Result<T, E extends Error_> {
  unwrap(): T;
  unwrapErr(): E;
  isOk(): boolean;
  isErr(): boolean;
}

export class Ok<T, E extends Error_ = Error_> implements Result<T, E> {
  constructor(readonly value: T) {}
  unwrapErr(): E {
    throw new Error("No error");
  }
  unwrap(): T {
    return this.value;
  }

  isOk(): boolean {
    return true;
  }

  isErr(): boolean {
    return !this.isOk();
  }
}

export class Err<E extends Error_ = Error_> implements Result<any, E> {
  constructor(readonly error: E) {}
  unwrapErr(): E {
    return this.error;
  }
  unwrap(): never {
    throw new Error(this.error.message);
  }

  isOk(): boolean {
    return false;
  }

  isErr(): boolean {
    return !this.isOk();
  }
}

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}

const regex = /Error\(Contract, #(\d+)\)/;

// function parseError(message: string): Err | undefined {
//     const match = message.match(regex);
//     if (!match) {
//         return undefined;
//     }
//     if (Errors === undefined) {
//         return undefined;
//     }
//     let i = parseInt(match[1], 10);
//     let err = Errors[i];
//     if (err) {
//         return new Err(err);
//     }
//     return undefined;
// }

export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CCYM3UHM65NEIE45GXPC6PVIGYHOUYKB3EMNVX5GNTS6OXFUQOJF7DF2",
  },
} as const;

export type DataKey =
  | { tag: "Order"; values: readonly [u64] }
  | { tag: "Recipient"; values: void }
  | { tag: "User"; values: readonly [string] }
  | { tag: "Token"; values: void }
  | { tag: "RecipientClaimed"; values: void }
  | { tag: "TargetAmount"; values: void }
  | { tag: "OrderCounter"; values: void }
  | { tag: "UserOrderTracker"; values: readonly [string] }
  | { tag: "Balance"; values: readonly [string] }
  | { tag: "UserRewards"; values: readonly [string] }
  | { tag: "UserTransactionId"; values: readonly [string] }
  | { tag: "UserRegId"; values: readonly [string] }
  | { tag: "UserCounter"; values: void };

export interface Token {
  address: string;
}

export interface UserOrderTracker {
  reward_percentage: u32;
  rewards: Array<i128>;
  total_value: i128;
}

export interface Order {
  amount: i128;
  fulfilled: boolean;
  id: u64;
  timestamp: u64;
  user: string;
}

export interface User {
  email: string;
  id: u64;
  name: string;
  registered: boolean;
  timestamp: u64;
  user: string;
}

// const Errors = {

// }

export class Contract {
  spec: ContractSpec;
  constructor(public readonly options: ClassOptions) {
    this.spec = new ContractSpec([
      "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAADQAAAAEAAAAAAAAABU9yZGVyAAAAAAAAAQAAAAYAAAAAAAAAAAAAAAlSZWNpcGllbnQAAAAAAAABAAAAAAAAAARVc2VyAAAAAQAAABMAAAAAAAAAAAAAAAVUb2tlbgAAAAAAAAAAAAAAAAAAEFJlY2lwaWVudENsYWltZWQAAAAAAAAAAAAAAAxUYXJnZXRBbW91bnQAAAAAAAAAAAAAAAxPcmRlckNvdW50ZXIAAAABAAAAAAAAABBVc2VyT3JkZXJUcmFja2VyAAAAAQAAABMAAAABAAAAAAAAAAdCYWxhbmNlAAAAAAEAAAATAAAAAQAAAAAAAAALVXNlclJld2FyZHMAAAAAAQAAABMAAAABAAAAAAAAABFVc2VyVHJhbnNhY3Rpb25JZAAAAAAAAAEAAAATAAAAAQAAAAAAAAAJVXNlclJlZ0lkAAAAAAAAAQAAABMAAAAAAAAAAAAAAAtVc2VyQ291bnRlcgA=",
      "AAAAAQAAAAAAAAAAAAAABVRva2VuAAAAAAAAAQAAAAAAAAAHYWRkcmVzcwAAAAAT",
      "AAAAAQAAAAAAAAAAAAAAEFVzZXJPcmRlclRyYWNrZXIAAAADAAAAAAAAABFyZXdhcmRfcGVyY2VudGFnZQAAAAAAAAQAAAAAAAAAB3Jld2FyZHMAAAAD6gAAAAsAAAAAAAAAC3RvdGFsX3ZhbHVlAAAAAAs=",
      "AAAAAQAAAAAAAAAAAAAABU9yZGVyAAAAAAAABQAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAAlmdWxmaWxsZWQAAAAAAAABAAAAAAAAAAJpZAAAAAAABgAAAAAAAAAJdGltZXN0YW1wAAAAAAAABgAAAAAAAAAEdXNlcgAAABM=",
      "AAAAAQAAAAAAAAAAAAAABFVzZXIAAAAGAAAAAAAAAAVlbWFpbAAAAAAAABAAAAAAAAAAAmlkAAAAAAAGAAAAAAAAAARuYW1lAAAAEAAAAAAAAAAKcmVnaXN0ZXJlZAAAAAAAAQAAAAAAAAAJdGltZXN0YW1wAAAAAAAABgAAAAAAAAAEdXNlcgAAABM=",
      "AAAAAAAAAAAAAAAFdG9rZW4AAAAAAAAAAAAAAQAAABM=",
      "AAAAAAAAAAAAAAAJcmVjaXBpZW50AAAAAAAAAAAAAAEAAAAT",
      "AAAAAAAAAAAAAAAMdHJhbnNmZXJfeGxtAAAAAwAAAAAAAAAEZnJvbQAAABMAAAAAAAAAAnRvAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAABAAAABg==",
      "AAAAAAAAAAAAAAAIcmVnaXN0ZXIAAAADAAAAAAAAAAx1c2VyX2FkZHJlc3MAAAATAAAAAAAAAARuYW1lAAAAEAAAAAAAAAAFZW1haWwAAAAAAAAQAAAAAQAAAAE=",
      "AAAAAAAAAAAAAAAFbG9naW4AAAAAAAABAAAAAAAAAAx1c2VyX2FkZHJlc3MAAAATAAAAAQAAAAE=",
      "AAAAAAAAAAAAAAANZ2V0X3VzZXJfbmFtZQAAAAAAAAEAAAAAAAAADHVzZXJfYWRkcmVzcwAAABMAAAABAAAAEA==",
      "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAwAAAAAAAAAJcmVjaXBpZW50AAAAAAAAEwAAAAAAAAANdGFyZ2V0X2Ftb3VudAAAAAAAAAsAAAAAAAAABXRva2VuAAAAAAAAEwAAAAA=",
      "AAAAAAAAAAAAAAALcGxhY2Vfb3JkZXIAAAAAAgAAAAAAAAAEdXNlcgAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAEAAAAG",
      "AAAAAAAAAAAAAAAJZ2V0X29yZGVyAAAAAAAAAQAAAAAAAAAIb3JkZXJfaWQAAAAGAAAAAQAAB9AAAAAFT3JkZXIAAAA=",
      "AAAAAAAAAAAAAAAWZ2V0X3RvdGFsX3VzZXJfcmV3YXJkcwAAAAAAAQAAAAAAAAAEdXNlcgAAABMAAAABAAAACw==",
      "AAAAAAAAAAAAAAATcHJvY2Vzc191c2VyX3Jld2FyZAAAAAABAAAAAAAAAAR1c2VyAAAAEwAAAAEAAAAB",
      "AAAAAAAAAAAAAAASZ2V0X29yZGVyc19ieV91c2VyAAAAAAADAAAAAAAAAAR1c2VyAAAAEwAAAAAAAAAFc3RhcnQAAAAAAAAGAAAAAAAAAAVsaW1pdAAAAAAAAAYAAAABAAAD6gAAB9AAAAAFT3JkZXIAAAA=",
    ]);
  }
  token = async <R extends ResponseTypes = undefined>(
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `string`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
       *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
       *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
       */
      responseType?: R;
      /**
       * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
       */
      secondsToWait?: number;
    } = {}
  ) => {
    return await invoke({
      method: "token",
      args: this.spec.funcArgsToScVals("token", {}),
      ...options,
      ...this.options,
      parseResultXdr: (xdr): string => {
        return this.spec.funcResToNative("token", xdr);
      },
    });
  };

  recipient = async <R extends ResponseTypes = undefined>(
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `string`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
       *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
       *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
       */
      responseType?: R;
      /**
       * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
       */
      secondsToWait?: number;
    } = {}
  ) => {
    return await invoke({
      method: "recipient",
      args: this.spec.funcArgsToScVals("recipient", {}),
      ...options,
      ...this.options,
      parseResultXdr: (xdr): string => {
        return this.spec.funcResToNative("recipient", xdr);
      },
    });
  };

  transferXlm = async <R extends ResponseTypes = undefined>(
    { from, to, amount }: { from: string; to: string; amount: i128 },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `u64`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
       *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
       *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
       */
      responseType?: R;
      /**
       * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
       */
      secondsToWait?: number;
    } = {}
  ) => {
    return await invoke({
      method: "transfer_xlm",
      args: this.spec.funcArgsToScVals("transfer_xlm", {
        from: new Address(from),
        to: new Address(to),
        amount,
      }),
      ...options,
      ...this.options,
      parseResultXdr: (xdr): u64 => {
        return this.spec.funcResToNative("transfer_xlm", xdr);
      },
    });
  };

  register = async <R extends ResponseTypes = undefined>(
    {
      user_address,
      name,
      email,
    }: { user_address: string; name: string; email: string },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `boolean`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
       *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
       *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
       */
      responseType?: R;
      /**
       * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
       */
      secondsToWait?: number;
    } = {}
  ) => {
    return await invoke({
      method: "register",
      args: this.spec.funcArgsToScVals("register", {
        user_address: new Address(user_address),
        name,
        email,
      }),
      ...options,
      ...this.options,
      parseResultXdr: (xdr): boolean => {
        return this.spec.funcResToNative("register", xdr);
      },
    });
  };

  login = async <R extends ResponseTypes = undefined>(
    { user_address }: { user_address: string },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `boolean`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
       *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
       *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
       */
      responseType?: R;
      /**
       * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
       */
      secondsToWait?: number;
    } = {}
  ) => {
    return await invoke({
      method: "login",
      args: this.spec.funcArgsToScVals("login", {
        user_address: new Address(user_address),
      }),
      ...options,
      ...this.options,
      parseResultXdr: (xdr): boolean => {
        return this.spec.funcResToNative("login", xdr);
      },
    });
  };

  getUserName = async <R extends ResponseTypes = undefined>(
    { user_address }: { user_address: string },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `string`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
       *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
       *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
       */
      responseType?: R;
      /**
       * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
       */
      secondsToWait?: number;
    } = {}
  ) => {
    return await invoke({
      method: "get_user_name",
      args: this.spec.funcArgsToScVals("get_user_name", {
        user_address: new Address(user_address),
      }),
      ...options,
      ...this.options,
      parseResultXdr: (xdr): string => {
        return this.spec.funcResToNative("get_user_name", xdr);
      },
    });
  };

  initialize = async <R extends ResponseTypes = undefined>(
    {
      recipient,
      target_amount,
      token,
    }: { recipient: string; target_amount: i128; token: string },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `void`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
       *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
       *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
       */
      responseType?: R;
      /**
       * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
       */
      secondsToWait?: number;
    } = {}
  ) => {
    return await invoke({
      method: "initialize",
      args: this.spec.funcArgsToScVals("initialize", {
        recipient: new Address(recipient),
        target_amount,
        token: new Address(token),
      }),
      ...options,
      ...this.options,
      parseResultXdr: () => {},
    });
  };

  placeOrder = async <R extends ResponseTypes = undefined>(
    { user, amount }: { user: string; amount: i128 },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `u64`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
       *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
       *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
       */
      responseType?: R;
      /**
       * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
       */
      secondsToWait?: number;
    } = {}
  ) => {
    return await invoke({
      method: "place_order",
      args: this.spec.funcArgsToScVals("place_order", {
        user: new Address(user),
        amount,
      }),
      ...options,
      ...this.options,
      parseResultXdr: (xdr): u64 => {
        return this.spec.funcResToNative("place_order", xdr);
      },
    });
  };

  getOrder = async <R extends ResponseTypes = undefined>(
    { order_id }: { order_id: u64 },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `Order`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
       *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
       *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
       */
      responseType?: R;
      /**
       * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
       */
      secondsToWait?: number;
    } = {}
  ) => {
    return await invoke({
      method: "get_order",
      args: this.spec.funcArgsToScVals("get_order", { order_id }),
      ...options,
      ...this.options,
      parseResultXdr: (xdr): Order => {
        return this.spec.funcResToNative("get_order", xdr);
      },
    });
  };

  getTotalUserRewards = async <R extends ResponseTypes = undefined>(
    { user }: { user: string },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `i128`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
       *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
       *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
       */
      responseType?: R;
      /**
       * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
       */
      secondsToWait?: number;
    } = {}
  ) => {
    return await invoke({
      method: "get_total_user_rewards",
      args: this.spec.funcArgsToScVals("get_total_user_rewards", {
        user: new Address(user),
      }),
      ...options,
      ...this.options,
      parseResultXdr: (xdr): i128 => {
        return this.spec.funcResToNative("get_total_user_rewards", xdr);
      },
    });
  };

  processUserReward = async <R extends ResponseTypes = undefined>(
    { user }: { user: string },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `boolean`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
       *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
       *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
       */
      responseType?: R;
      /**
       * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
       */
      secondsToWait?: number;
    } = {}
  ) => {
    return await invoke({
      method: "process_user_reward",
      args: this.spec.funcArgsToScVals("process_user_reward", {
        user: new Address(user),
      }),
      ...options,
      ...this.options,
      parseResultXdr: (xdr): boolean => {
        return this.spec.funcResToNative("process_user_reward", xdr);
      },
    });
  };

  getOrdersByUser = async <R extends ResponseTypes = undefined>(
    { user, start, limit }: { user: string; start: u64; limit: u64 },
    options: {
      /**
       * The fee to pay for the transaction. Default: 100.
       */
      fee?: number;
      /**
       * What type of response to return.
       *
       *   - `undefined`, the default, parses the returned XDR as `Array<Order>`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
       *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
       *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
       */
      responseType?: R;
      /**
       * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
       */
      secondsToWait?: number;
    } = {}
  ) => {
    return await invoke({
      method: "get_orders_by_user",
      args: this.spec.funcArgsToScVals("get_orders_by_user", {
        user: new Address(user),
        start,
        limit,
      }),
      ...options,
      ...this.options,
      parseResultXdr: (xdr): Array<Order> => {
        return this.spec.funcResToNative("get_orders_by_user", xdr);
      },
    });
  };
}
