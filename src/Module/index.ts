import { parse } from 'acorn';
import { Bundle } from '../Bundle';

export class Module {
  public path: string;
  public code: string;
  public bundle: Bundle;
  public ast: acorn.Node;
  constructor({ path, code, bundle }: { path: string; code: string; bundle: Bundle }) {
    this.path = path;
    this.code = code;
    this.bundle = bundle;

    this.ast = parse(code, {
      ecmaVersion: 6,
      sourceType: 'module',
    });
  }
}
