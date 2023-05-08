import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import * as acorn from 'acorn';
import MagicString from 'magic-string';
import { Graph } from './Graph';
import { Module } from './Module';

export interface GenericEsTreeNode extends acorn.Node {
  [key: string]: any;
}

function parseImportNode(esTreeNode: GenericEsTreeNode): any {
  for (const [key, value] of Object.entries(esTreeNode)) {
    if (key === 'type' && value === 'ImportDeclaration') {
      return esTreeNode;
    } else if (Array.isArray(value)) {
      for (const child of value) {
        return parseImportNode(child as GenericEsTreeNode);
      }
    }
  }
}

export function rollup(entryFile: string) {
  return {
    generate: async () => {
      let code = await readFile(entryFile, 'utf-8');
      const ast = acorn.parse(code, { ecmaVersion: 'latest', sourceType: 'module' });
      const importDeclaration = parseImportNode(ast);
      const graph = new Graph();
      graph.entryModule = new Module(entryFile);
      let dependentCode = '';
      if (importDeclaration) {
        const magicString = new MagicString(code);
        magicString.remove(importDeclaration.start, importDeclaration.end);
        code = magicString.toString();
        const dependencyFileName = importDeclaration.source.value + '.js';
        dependentCode = await readFile(resolve(dirname(entryFile), dependencyFileName), 'utf-8');
        const dependencyModule = new Module(dependencyFileName);
        dependencyModule.code = dependentCode;
        graph.entryModule.dependencies.push(dependencyModule);
      }
      return {
        graph,
        code: dependentCode + code,
      };
    },
  };
}
