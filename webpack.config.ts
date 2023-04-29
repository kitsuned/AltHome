import { ProvidePlugin, DefinePlugin } from 'webpack';

import WebOSPackagerPlugin from '@kitsuned/webos-packager-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TSConfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

import { WebpackMultipleConfigurations, JsonTransformer } from 'chore/webpack-utils';

import { name, version, description, repository } from './package.json';

const transformer = new JsonTransformer({
	APP_ID: name,
	APP_VERSION: version,
});

export default <WebpackMultipleConfigurations<{ WEBPACK_SERVE?: boolean }>>[
	(_, argv) => ({
		name: 'app',
		target: 'web',
		mode: argv.mode ?? 'development',
		entry: './src/index.tsx',
		devtool: argv.mode === 'production' ? 'source-map' : 'eval',
		devServer: {
			hot: true,
		},
		output: {
			clean: true,
			filename: 'app.js',
		},
		resolve: {
			extensions: [...(argv.mode !== 'development' ? [] : ['.dev.ts']), '.js', '.ts', '.tsx'],
			plugins: [new TSConfigPathsPlugin()],
		},
		module: {
			rules: [
				{
					test: /.tsx?$/,
					loader: 'esbuild-loader',
					options: {
						loader: 'tsx',
						target: 'chrome79',
					},
				},
				{
					test: /.scss$/,
					use: [
						MiniCssExtractPlugin.loader,
						'css-loader',
						'sass-loader',
						{
							loader: 'postcss-loader',
							options: {
								postcssOptions: {
									plugins: ['autoprefixer', 'postcss-preset-env'],
								},
							},
						},
					],
				},
				{
					test: /.png$/,
					type: 'asset/resource',
					generator: {
						filename: 'assets/[hash][ext]',
					},
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
				__DEV__: JSON.stringify(argv.mode === 'development'),
				'process.env.APP_ID': JSON.stringify(name),
			}),
			new MiniCssExtractPlugin(),
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
					{
						from: 'agentd*',
						context: 'agent',
						to: 'service',
						toType: 'file',
					},
				],
			}),
			new WebOSPackagerPlugin({
				id: name,
				version,
				description,
				emitManifest: true,
				setExecutableBit: true,
				metadata: {
					title: 'AltHome',
					iconUrl:
						'https://raw.githubusercontent.com/kitsuned/AltHome/v1.0.0/manifests/icon320.png',
					sourceUrl: repository,
					rootRequired: true,
				},
			}),
		],
	}),
];
