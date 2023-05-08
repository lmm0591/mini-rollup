const { resolve } = require('node:path');
const { readdirSync, readFileSync } = require('node:fs');
const { expect } = require('chai');
const { rollup } = require('../../dist/rollup');

function runTestSuiteWithSamples(suiteName, samplesDirectory, runTest) {
  xdescribe(suiteName, () => {
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
