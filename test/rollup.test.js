const { expect } = require('chai');
const { rollup } = require('../dist/rollup');

const fooCode = `export default function foo() {
  return 42;
}
`;
const rawMainCode = `import foo from './foo';
console.log(foo());
`;

const mainCode = `export default function foo() {
  return 42;
}

console.log(foo());
`;

describe('初始化 mini rollup', () => {
  it('有一个 rollup 入口方法', () => {
    expect(typeof rollup).eql('function');
  });

  it('文件加载成功后会生成一个 bundle 保存加载的代码', () => {
    const bundle = rollup('./test/samples/foo.js');
    expect(bundle).not.undefined;
  });

  it('调用 generate 方法返回文件里的内容', async () => {
    const bundle = rollup('./test/samples/foo.js');
    const { code } = await bundle.generate();
    expect(code).to.eql(fooCode);
  });

  it('加载文件里的 import xx from xxx 文件', async () => {
    const bundle = rollup('./test/samples/main.js');
    const { code } = await bundle.generate();
    expect(code).to.eql(mainCode);
  });

  it('当调用 generate 方法时，入口文件将被会解析到 Graph 的 entryModule 属性中', async () => {
    const bundle = rollup('./test/samples/main.js');
    const { graph } = await bundle.generate();

    expect(graph.entryModule).to.contain({
      id: './test/samples/main.js',
      code: rawMainCode,
    });
  });

  it('当调用 generate 方法时，entryModule 解析文件里的 Import 语句', async () => {
    const bundle = rollup('./test/samples/main.js');
    const { graph } = await bundle.generate();

    expect(graph.entryModule.importDescriptions.get('foo')).to.contain({
      name: 'default',
      source: './foo',
    });
  });

  it('当文件里的 import 语句时，将会被记录到 Graph 的依赖关系中', async () => {
    const bundle = rollup('./test/samples/main.js');
    const { graph } = await bundle.generate();
    expect(graph.entryModule.dependencies).length(1);
    expect(graph.entryModule.dependencies[0]).to.contain({
      id: './foo.js',
      code: fooCode,
    });
  });
});
