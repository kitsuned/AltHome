import { ProvidePlugin, DefinePlugin } from 'webpack';

import CopyPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TSConfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

import {
	JsonTransformer,
	AresPackagerPlugin,
	PermissionPlugin,
	WebOSBrewManifestPlugin,
	WebpackMultipleConfigurations,
} from 'chore/webpack-utils';

import { name, version, description } from './package.json';

const transformer = new JsonTransformer({
	APP_ID: name,
	APP_VERSION: version,
});

export default <WebpackMultipleConfigurations<{ WEBPACK_SERVE?: boolean; }>>[
	(env, argv) => ({
		name: 'app',
		target: 'web',
		mode: argv.mode ?? 'development',
		entry: './src/index.tsx',
		devtool: argv.mode === 'production' ? 'source-map' : 'eval',
		devServer: {
			hot: true,
		},
		output: {
			filename: 'app.js',
			clean: true,
		},
		resolve: {
			extensions: [
				...argv.mode !== 'development' ? [] : ['.dev.ts'],
				'.js',
				'.ts',
				'.tsx',
			],
			plugins: [
				new TSConfigPathsPlugin(),
			],
		},
		module: {
			rules: [
				{
					test: /.tsx?$/,
					loader: 'esbuild-loader',
					options: {
						loader: 'tsx',
						target: 'ES2015',
					},
				},
				{
					test: /.scss$/,
					use: [
						'style-loader',
						'css-loader',
						'sass-loader',
					],
				},
			],
		},
		performance: {
			hints: false,
		},
		plugins: [
			new ProvidePlugin({
				React: 'react',
			}),
			new DefinePlugin({
				__DEV__: JSON.stringify(!process.env.PRODUCTION),
				'process.env.APP_ID': JSON.stringify(name),
			}),
			new HtmlWebpackPlugin({
				template: './src/app/index.html',
			}),
			new CopyPlugin({
				patterns: [
					{
						from: '**/*',
						context: 'manifests',
						priority: 10,
					},
					{
						from: '**/*.json',
						context: 'manifests',
						transform: transformer.transform,
						priority: 0,
					},
				],
			}),
			...!env?.WEBPACK_SERVE ? [
				new PermissionPlugin(),
				new AresPackagerPlugin(),
				new WebOSBrewManifestPlugin({
					appDescription: description,
					sourceUrl: 'https://github.com/kitsuned/AltHome',
					iconUri: './manifests/icon320.png',
					rootRequired: true,
				}),
			] : [],
		],
	}),
];
