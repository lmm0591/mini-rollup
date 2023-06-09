import * as acorn from 'acorn';

export interface GenericEsTreeNode extends acorn.Node {
  [key: string]: any;
}

function parseImportNode(esTreeNode: GenericEsTreeNode, importDeclarations: GenericEsTreeNode[]): any {
  for (const [key, value] of Object.entries(esTreeNode)) {
    if (key === 'type' && value === 'ImportDeclaration') {
      importDeclarations.push(esTreeNode);
    } else if (Array.isArray(value)) {
      for (const child of value) {
        parseImportNode(child as GenericEsTreeNode, importDeclarations);
      }
    }
  }
}

interface ImportDescription {
  name: string;
  source: string;
}

interface ImportStatement {
  name: string;
  start: number;
  end: number;
}

export class Module {
  declare code: string;
  readonly importDescriptions = new Map<string, ImportDescription>();
  readonly importStatements = new Map<string, ImportStatement>();
  readonly dependencies: Module[] = [];
  constructor(public id: string) {}

  addDependency(module: Module) {
    this.dependencies.push(module);
  }

  setSource(code: string) {
    this.code = code;
    const ast = acorn.parse(code, { ecmaVersion: 'latest', sourceType: 'module' });
    const importDeclarations: GenericEsTreeNode[] = [];
    parseImportNode(ast, importDeclarations);
    importDeclarations.forEach((importDeclaration) => {
      this.addImport(importDeclaration);
    });
  }

  private addImport(node: GenericEsTreeNode): void {
    const source = node.source.value;

    this.importStatements.set(source, {
      name: source,
      start: node.start,
      end: node.end,
    });

    for (const specifier of node.specifiers) {
      this.importDescriptions.set(specifier.local.name, {
        name: 'default',
        source,
      });
    }
  }
}
