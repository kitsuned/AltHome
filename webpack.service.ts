import { DefinePlugin } from 'webpack';

import CopyPlugin from 'copy-webpack-plugin';

import { JsonTransformer } from 'webpack-utils';
import type { WebpackConfigFunction } from 'webpack-utils';

import { id, version } from './package.json';

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
				loader: 'babel-loader',
				options: {
					presets: [
						['@babel/env', { targets: { node: 12 } }],
						['@babel/typescript', { onlyRemoveTypeImports: true }],
					],
				},
			},
			{
				test: /.source.\w+$/,
				type: 'asset/source',
				loader: 'babel-loader',
				options: {
					presets: [
						[
							'@babel/env',
							{
								// surface manager uses a custom JS engine: QT V4
								// let's set target to something ancient just to cover ES3
								targets: { chrome: 4 },
							},
						],
					],
					plugins: [
						[
							'minify-replace',
							{
								replacements: [
									{
										identifierName: '__APP_ID__',
										replacement: {
											type: 'stringLiteral',
											value: id,
										},
									},
								],
							},
						],
					],
				},
			},
		],
	},
	plugins: [
		new DefinePlugin({
			__DEV__: JSON.stringify(argv.mode === 'development'),
			'process.env.APP_ID': JSON.stringify(id),
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
