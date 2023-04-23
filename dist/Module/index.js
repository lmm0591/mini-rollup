"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Module = void 0;
const acorn_1 = require("acorn");
class Module {
    constructor({ path, code, bundle }) {
        this.path = path;
        this.code = code;
        this.bundle = bundle;
        this.ast = (0, acorn_1.parse)(code, {
            ecmaVersion: 6,
            sourceType: 'module',
        });
    }
}
exports.Module = Module;
