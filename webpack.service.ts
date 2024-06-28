import { DefinePlugin } from 'webpack';

import CopyPlugin from 'copy-webpack-plugin';

import { id, version } from './package.json';
import { JsonTransformer } from './src/chore/webpack-utils';
import type { WebpackConfigFunction } from './src/chore/webpack-utils';

const SERVICE_ID = `${id}.service`;

const transformer = new JsonTransformer({
	APP_ID: id,
	APP_VERSION: version,
	SERVICE_ID,
});

const config: WebpackConfigFunction<{ WEBPACK_SERVE?: boolean }> = (_, argv) => ({
	id: SERVICE_ID,
	name: 'service',
	mode: argv.mode ?? 'development',
	target: 'node8.12',
	entry: './service/index.ts',
	output: {
		filename: 'service.js',
	},
	externals: {
		palmbus: 'commonjs palmbus',
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
	module: {
		rules: [
			// TODO: move to Babel
			{
				test: /.[jt]sx?$/,
				loader: 'esbuild-loader',
				options: {
					loader: 'ts',
					target: 'node12.22',
				},
			},
		],
	},
	plugins: [
		new DefinePlugin({
			__DEV__: JSON.stringify(argv.mode === 'development'),
			'process.env.SERVICE_ID': JSON.stringify(SERVICE_ID),
		}),
		new CopyPlugin({
			patterns: [
				{
					from: '*.json',
					context: 'manifests/service',
					transform: transformer.transform,
				},
			],
		}),
	],
});

export default config;
