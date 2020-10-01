import { BundleDevTool, BundleMode, BundleTarget, getWebpackConfig } from '@luddites-me/ts-tools';

export default getWebpackConfig({
  bundleTarget: BundleTarget.WEB,
  devtool: BundleDevTool.FILE,
  distDirectory: './dist',
  sourceDirectory: './.tmp',
  libraryName: 'Protect',
  mode: BundleMode.PRODUCTION
});
