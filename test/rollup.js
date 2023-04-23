const { expect } = require('chai');
const { rollup } = require('../dist/rollup');
const { resolve } = require('path');

const fooCode = `export default function foo () {
	return 42;
}`;

describe('初始化 mini rollup', () => {
  it('有一个 rollup 入口方法', () => {
    expect(typeof rollup).eql('function');
  });

  it('rollup 方法可以接受一个入口文件路径', () => {
    expect(() => {
      rollup('./test/samples/foo.js');
    }).not.throw();
  });

  it('rollup 方法返回一个 Promise', () => {
    expect(rollup('./test/samples/foo.js')).instanceof(Promise);
  });

  it('文件加载成功后会生成一个 bundle 保存加载的代码', () => {
    return rollup('./test/samples/foo.js').then((bundle) => {});
  });

  it('调用 generate 方法返回文件里的内容', () => {
    return rollup('./test/samples/foo.js').then((bundle) => {
      expect(bundle.generate().code).to.eql(fooCode);
    });
  });

  it('加载文件代码缓存起来', () => {
    return rollup('./test/samples/foo.js').then((bundle) => {
      const path = resolve('./test/samples/foo.js');
      expect(bundle.modules[path]).to.contain({
        code: fooCode,
        path,
        bundle,
      });
    });
  });

  it('加载文件后生成文件对应的 AST', () => {
    return rollup('./test/samples/foo.js').then((bundle) => {
      const path = resolve('./test/samples/foo.js');
      expect(bundle.modules[path].ast.body[0]).not.undefined;
    });
  });
});
