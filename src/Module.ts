export class Module {
  declare code: string;
  readonly dependencies: Module[] = [];
  constructor(public id: string) {}

  addDependency(module: Module) {
    this.dependencies.push(module);
  }
}
