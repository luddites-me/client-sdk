import { BundleTarget, getWebpackConfig } from '@ns8/protect-tools-bundle';

export default getWebpackConfig({
  bundleTarget: BundleTarget.WEB,
  distDirectory: './dist',
  sourceDirectory: './src/index.ts',
  libraryName: 'protect',
});
