import { readFile, readFileSync } from 'fs';
import { Module } from '../Module';
import { resolve } from 'path';

export class Bundle {
  modules: Record<string, Module> = {};
  modulePromises: Record<string, Promise<Module>> = {};
  entryPath: string;
  constructor({ entry }: { entry: string }) {
    this.entryPath = resolve(entry);
  }

  private fetchModule(path: string) {
    if (!this.modulePromises[path]) {
      this.modulePromises[path] = new Promise((resolve) => {
        readFile(path, { encoding: 'utf-8' }, (_, code) => {
          const module = new Module({ path, code, bundle: this });
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
      code: readFileSync(this.entryPath, { encoding: 'utf-8' }),
      map: null, // TODO...
    };
  }
}
