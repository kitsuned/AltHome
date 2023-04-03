import { Configuration } from 'webpack';

import CopyPlugin from 'copy-webpack-plugin';

import { AresPackagerPlugin, PermissionPlugin, WebOSBrewManifestPlugin } from 'chore/webpack-utils';

import { description } from './package.json';

export default <Configuration>{
	name: 'ares',
	entry: {},
	mode: 'production',
	performance: {
		hints: false,
	},
	plugins: [
		new CopyPlugin({
			patterns: [
				{
					from: 'agentd*',
					context: 'agent',
					to: 'service',
					toType: 'file',
				},
			],
		}),
		new PermissionPlugin(),
		new AresPackagerPlugin(),
		new WebOSBrewManifestPlugin({
			appDescription: description,
			sourceUrl: 'https://github.com/kitsuned/AltHome',
			iconUri: './manifests/icon320.png',
			rootRequired: true,
		}),
	],
};
