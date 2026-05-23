"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contract = exports.networks = exports.Err = exports.Ok = exports.Address = void 0;
const soroban_client_1 = require("soroban-client");
Object.defineProperty(exports, "Address", { enumerable: true, get: function () { return soroban_client_1.Address; } });
const buffer_1 = require("buffer");
const invoke_js_1 = require("./invoke.js");
__exportStar(require("./invoke.js"), exports);
__exportStar(require("./method-options.js"), exports);
;
;
class Ok {
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
exports.Ok = Ok;
class Err {
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
exports.Err = Err;
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || buffer_1.Buffer;
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
exports.networks = {
    testnet: {
        networkPassphrase: "Test SDF Network ; September 2015",
        contractId: "CCYM3UHM65NEIE45GXPC6PVIGYHOUYKB3EMNVX5GNTS6OXFUQOJF7DF2",
    }
};
const Errors = {};
class Contract {
    options;
    spec;
    constructor(options) {
        this.options = options;
        this.spec = new soroban_client_1.ContractSpec([
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
        return await (0, invoke_js_1.invoke)({
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
        return await (0, invoke_js_1.invoke)({
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
        return await (0, invoke_js_1.invoke)({
            method: 'transfer_xlm',
            args: this.spec.funcArgsToScVals("transfer_xlm", { from: new soroban_client_1.Address(from), to: new soroban_client_1.Address(to), amount }),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("transfer_xlm", xdr);
            },
        });
    };
    register = async ({ user_address, name, email }, options = {}) => {
        return await (0, invoke_js_1.invoke)({
            method: 'register',
            args: this.spec.funcArgsToScVals("register", { user_address: new soroban_client_1.Address(user_address), name, email }),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("register", xdr);
            },
        });
    };
    login = async ({ user_address }, options = {}) => {
        return await (0, invoke_js_1.invoke)({
            method: 'login',
            args: this.spec.funcArgsToScVals("login", { user_address: new soroban_client_1.Address(user_address) }),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("login", xdr);
            },
        });
    };
    getUserName = async ({ user_address }, options = {}) => {
        return await (0, invoke_js_1.invoke)({
            method: 'get_user_name',
            args: this.spec.funcArgsToScVals("get_user_name", { user_address: new soroban_client_1.Address(user_address) }),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("get_user_name", xdr);
            },
        });
    };
    initialize = async ({ recipient, target_amount, token }, options = {}) => {
        return await (0, invoke_js_1.invoke)({
            method: 'initialize',
            args: this.spec.funcArgsToScVals("initialize", { recipient: new soroban_client_1.Address(recipient), target_amount, token: new soroban_client_1.Address(token) }),
            ...options,
            ...this.options,
            parseResultXdr: () => { },
        });
    };
    placeOrder = async ({ user, amount }, options = {}) => {
        return await (0, invoke_js_1.invoke)({
            method: 'place_order',
            args: this.spec.funcArgsToScVals("place_order", { user: new soroban_client_1.Address(user), amount }),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("place_order", xdr);
            },
        });
    };
    getOrder = async ({ order_id }, options = {}) => {
        return await (0, invoke_js_1.invoke)({
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
        return await (0, invoke_js_1.invoke)({
            method: 'get_total_user_rewards',
            args: this.spec.funcArgsToScVals("get_total_user_rewards", { user: new soroban_client_1.Address(user) }),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("get_total_user_rewards", xdr);
            },
        });
    };
    processUserReward = async ({ user }, options = {}) => {
        return await (0, invoke_js_1.invoke)({
            method: 'process_user_reward',
            args: this.spec.funcArgsToScVals("process_user_reward", { user: new soroban_client_1.Address(user) }),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("process_user_reward", xdr);
            },
        });
    };
    getOrdersByUser = async ({ user, start, limit }, options = {}) => {
        return await (0, invoke_js_1.invoke)({
            method: 'get_orders_by_user',
            args: this.spec.funcArgsToScVals("get_orders_by_user", { user: new soroban_client_1.Address(user), start, limit }),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("get_orders_by_user", xdr);
            },
        });
    };
}
exports.Contract = Contract;
