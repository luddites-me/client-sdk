import { BundleTarget, getWebpackConfig } from '@ns8/protect-tools-js';

export default getWebpackConfig({
  bundleTarget: BundleTarget.WEB,
  devtool: 'inline-source-map',
  distDirectory: './dist',
  sourceDirectory: './.tmp',
  libraryName: 'Protect',
});
