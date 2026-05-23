import { ContractSpec, Address } from 'soroban-client';
import { Buffer } from "buffer";
import { invoke } from './invoke.js';
export * from './invoke.js';
export * from './method-options.js';
export { Address };
;
;
export class Ok {
    value;
    constructor(value) {
        this.value = value;
    }
    unwrapErr() {
        throw new Error('No error');
    }
    unwrap() {
        return this.value;
    }
    isOk() {
        return true;
    }
    isErr() {
        return !this.isOk();
    }
}
export class Err {
    error;
    constructor(error) {
        this.error = error;
    }
    unwrapErr() {
        return this.error;
    }
    unwrap() {
        throw new Error(this.error.message);
    }
    isOk() {
        return false;
    }
    isErr() {
        return !this.isOk();
    }
}
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
const regex = /Error\(Contract, #(\d+)\)/;
function parseError(message) {
    const match = message.match(regex);
    if (!match) {
        return undefined;
    }
    if (Errors === undefined) {
        return undefined;
    }
    let i = parseInt(match[1], 10);
    let err = Errors[i];
    if (err) {
        return new Err(err);
    }
    return undefined;
}
export const networks = {
    testnet: {
        networkPassphrase: "Test SDF Network ; September 2015",
        contractId: "CCYM3UHM65NEIE45GXPC6PVIGYHOUYKB3EMNVX5GNTS6OXFUQOJF7DF2",
    }
};
const Errors = {};
export class Contract {
    options;
    spec;
    constructor(options) {
        this.options = options;
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
            "AAAAAAAAAAAAAAASZ2V0X29yZGVyc19ieV91c2VyAAAAAAADAAAAAAAAAAR1c2VyAAAAEwAAAAAAAAAFc3RhcnQAAAAAAAAGAAAAAAAAAAVsaW1pdAAAAAAAAAYAAAABAAAD6gAAB9AAAAAFT3JkZXIAAAA="
        ]);
    }
    token = async (options = {}) => {
        return await invoke({
            method: 'token',
            args: this.spec.funcArgsToScVals("token", {}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("token", xdr);
            },
        });
    };
    recipient = async (options = {}) => {
        return await invoke({
            method: 'recipient',
            args: this.spec.funcArgsToScVals("recipient", {}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("recipient", xdr);
            },
        });
    };
    transferXlm = async ({ from, to, amount }, options = {}) => {
        return await invoke({
            method: 'transfer_xlm',
            args: this.spec.funcArgsToScVals("transfer_xlm", { from: new Address(from), to: new Address(to), amount }),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("transfer_xlm", xdr);
            },
        });
    };
    register = async ({ user_address, name, email }, options = {}) => {
        return await invoke({
            method: 'register',
            args: this.spec.funcArgsToScVals("register", { user_address: new Address(user_address), name, email }),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("register", xdr);
            },
        });
    };
    login = async ({ user_address }, options = {}) => {
        return await invoke({
            method: 'login',
            args: this.spec.funcArgsToScVals("login", { user_address: new Address(user_address) }),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("login", xdr);
            },
        });
    };
    getUserName = async ({ user_address }, options = {}) => {
        return await invoke({
            method: 'get_user_name',
            args: this.spec.funcArgsToScVals("get_user_name", { user_address: new Address(user_address) }),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("get_user_name", xdr);
            },
        });
    };
    initialize = async ({ recipient, target_amount, token }, options = {}) => {
        return await invoke({
            method: 'initialize',
            args: this.spec.funcArgsToScVals("initialize", { recipient: new Address(recipient), target_amount, token: new Address(token) }),
            ...options,
            ...this.options,
            parseResultXdr: () => { },
        });
    };
    placeOrder = async ({ user, amount }, options = {}) => {
        return await invoke({
            method: 'place_order',
            args: this.spec.funcArgsToScVals("place_order", { user: new Address(user), amount }),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("place_order", xdr);
            },
        });
    };
    getOrder = async ({ order_id }, options = {}) => {
        return await invoke({
            method: 'get_order',
            args: this.spec.funcArgsToScVals("get_order", { order_id }),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("get_order", xdr);
            },
        });
    };
    getTotalUserRewards = async ({ user }, options = {}) => {
        return await invoke({
            method: 'get_total_user_rewards',
            args: this.spec.funcArgsToScVals("get_total_user_rewards", { user: new Address(user) }),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("get_total_user_rewards", xdr);
            },
        });
    };
    processUserReward = async ({ user }, options = {}) => {
        return await invoke({
            method: 'process_user_reward',
            args: this.spec.funcArgsToScVals("process_user_reward", { user: new Address(user) }),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("process_user_reward", xdr);
            },
        });
    };
    getOrdersByUser = async ({ user, start, limit }, options = {}) => {
        return await invoke({
            method: 'get_orders_by_user',
            args: this.spec.funcArgsToScVals("get_orders_by_user", { user: new Address(user), start, limit }),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("get_orders_by_user", xdr);
            },
        });
    };
}
