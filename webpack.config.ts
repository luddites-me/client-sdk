import { BundleDevTool, BundleMode, BundleTarget, getWebpackConfig } from '@ns8/protect-tools-js';

export default getWebpackConfig({
  bundleTarget: BundleTarget.WEB,
  devtool: BundleDevTool.FILE,
  distDirectory: './dist',
  sourceDirectory: './.tmp',
  libraryName: 'Protect',
  mode: BundleMode.PRODUCTION
});
