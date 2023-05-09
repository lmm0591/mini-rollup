const { resolve } = require('node:path');
const { readdirSync, readFileSync } = require('node:fs');
const { expect } = require('chai');
const { rollup } = require('../../dist/rollup');

function runTestSuiteWithSamples(suiteName, samplesDirectory, runTest) {
  describe(suiteName, () => {
    for (const testDir of readdirSync(samplesDirectory)) {
      const expected = readFileSync(resolve(samplesDirectory, testDir, './_expected.js'), 'utf-8');
      it(testDir, async () => {
        const { code } = await runTest(testDir);
        expect(code).to.eql(expected);
      });
    }
  });
}

runTestSuiteWithSamples('测试文件依赖加载', resolve(__dirname, 'samples'), (testDir) => {
  const testEntryFile = resolve(__dirname, 'samples', testDir, 'main.js');
  const bundle = rollup(testEntryFile);
  return bundle.generate();
});

describe('测试文件加载', () => {
  it('当文件里调用多个 Import 语句时, graph 将分析出有多个 importDescriptions ', async () => {
    const bundle = rollup(resolve(__dirname, './samples/importMultiFiles/main.js'));
    const { graph } = await bundle.generate();
    expect(graph.entryModule.importDescriptions).to.length(2);
    expect(graph.entryModule.importDescriptions.get('foo')).not.undefined;
    expect(graph.entryModule.importDescriptions.get('bar')).not.undefined;
  });
});
