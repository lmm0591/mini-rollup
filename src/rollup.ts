import MagicString from 'magic-string';
import { Graph } from './Graph';

export function rollup(entryFile: string) {
  return {
    generate: async () => {
      const graph = new Graph(entryFile);
      await graph.build();
      let { code } = graph.entryModule;
      if (graph.entryModule.importStatements.size > 0) {
        const magicString = new MagicString(code);
        graph.entryModule.importStatements.forEach(({ start, end }) => {
          magicString.remove(start, end + 1);
        });
        code = magicString.toString();
      }
      const dependentCode = graph.entryModule.dependencies.map(({ code }) => code + '\n');
      return {
        graph,
        code: dependentCode.join('') + code,
      };
    },
  };
}
