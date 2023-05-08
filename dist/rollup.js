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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rollup = void 0;
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const acorn = __importStar(require("acorn"));
const magic_string_1 = __importDefault(require("magic-string"));
const Graph_1 = require("./Graph");
const Module_1 = require("./Module");
function parseImportNode(esTreeNode) {
    for (const [key, value] of Object.entries(esTreeNode)) {
        if (key === 'type' && value === 'ImportDeclaration') {
            return esTreeNode;
        }
        else if (Array.isArray(value)) {
            for (const child of value) {
                return parseImportNode(child);
            }
        }
    }
}
function rollup(entryFile) {
    return {
        generate: () => __awaiter(this, void 0, void 0, function* () {
            let code = yield (0, promises_1.readFile)(entryFile, 'utf-8');
            const ast = acorn.parse(code, { ecmaVersion: 'latest', sourceType: 'module' });
            const importDeclaration = parseImportNode(ast);
            const graph = new Graph_1.Graph();
            graph.entryModule = new Module_1.Module(entryFile);
            let dependentCode = '';
            if (importDeclaration) {
                const magicString = new magic_string_1.default(code);
                magicString.remove(importDeclaration.start, importDeclaration.end);
                code = magicString.toString();
                const dependencyFileName = importDeclaration.source.value + '.js';
                dependentCode = yield (0, promises_1.readFile)((0, node_path_1.resolve)((0, node_path_1.dirname)(entryFile), dependencyFileName), 'utf-8');
                const dependencyModule = new Module_1.Module(dependencyFileName);
                dependencyModule.code = dependentCode;
                graph.entryModule.dependencies.push(dependencyModule);
            }
            return {
                graph,
                code: dependentCode + code,
            };
        }),
    };
}
exports.rollup = rollup;
//# sourceMappingURL=rollup.js.map