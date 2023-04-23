"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bundle = void 0;
const fs_1 = require("fs");
const Module_1 = require("../Module");
const path_1 = require("path");
class Bundle {
    constructor({ entry }) {
        this.modules = {};
        this.modulePromises = {};
        this.entryPath = (0, path_1.resolve)(entry);
    }
    fetchModule(path) {
        if (!this.modulePromises[path]) {
            this.modulePromises[path] = new Promise((resolve) => {
                (0, fs_1.readFile)(path, { encoding: 'utf-8' }, (_, code) => {
                    const module = new Module_1.Module({ path, code, bundle: this });
                    this.modules[path] = module;
                    resolve(module);
                });
            });
        }
        return this.modulePromises[path];
    }
    build() {
        return this.fetchModule(this.entryPath);
    }
    generate() {
        return {
            code: (0, fs_1.readFileSync)(this.entryPath, { encoding: 'utf-8' }),
            map: null, // TODO...
        };
    }
}
exports.Bundle = Bundle;
