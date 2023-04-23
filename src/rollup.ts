import { Bundle } from './Bundle';

export function rollup(entryFile: string): Promise<Bundle> {
  const bundle = new Bundle({ entry: entryFile });
  return bundle.build().then(() => bundle);
}
