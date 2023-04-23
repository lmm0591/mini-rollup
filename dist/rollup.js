"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rollup = void 0;
const Bundle_1 = require("./Bundle");
function rollup(entryFile) {
    const bundle = new Bundle_1.Bundle({ entry: entryFile });
    return bundle.build().then(() => bundle);
}
exports.rollup = rollup;
