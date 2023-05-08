import { dirname, resolve } from 'node:path';
import { readFile } from 'node:fs/promises';
import { Module } from './Module';

export class Graph {
  public declare entryModule: Module;
  constructor(public entryFile: string) {}
  async build() {
    let code = await readFile(this.entryFile, 'utf-8');
    this.entryModule = new Module(this.entryFile);
    this.entryModule.setSource(code);

    const loadFiles: Promise<{ code: string; fileName: string }>[] = [];
    this.entryModule.importStatements.forEach(({ name }) => {
      const dependencyFileName = name + '.js';
      loadFiles.push(
        readFile(resolve(dirname(this.entryFile), dependencyFileName), 'utf-8').then((code) => {
          return { code, fileName: dependencyFileName };
        }),
      );
    });

    (await Promise.all(loadFiles)).forEach(({ code, fileName }) => {
      const dependencyModule = new Module(fileName);
      dependencyModule.setSource(code);
      this.entryModule.dependencies.push(dependencyModule);
    });
  }
}
