import { ProvidePlugin, DefinePlugin } from 'webpack';

import CopyPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TSConfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

import { JsonTransformer } from 'webpack-utils';
import type { WebpackConfigFunction } from 'webpack-utils';

import { id, version } from './package.json';

const transformer = new JsonTransformer({
	APP_ID: id,
	APP_VERSION: version,
});

const config: WebpackConfigFunction<{ WEBPACK_SERVE?: boolean }> = (_, argv) => ({
	id,
	name: 'app',
	target: 'web',
	mode: argv.mode ?? 'development',
	entry: './src/index.tsx',
	devtool: 'source-map',
	devServer: {
		hot: true,
	},
	output: {
		filename: 'app.js',
	},
	resolve: {
		extensions: [...(argv.mode !== 'development' ? [] : ['.dev.ts']), '.js', '.ts', '.tsx'],
		plugins: [new TSConfigPathsPlugin()],
	},
	module: {
		rules: [
			{
				test: /\.[mc]?[jt]sx?$/,
				exclude: [/node_modules\/core-js/],
				use: {
					loader: 'babel-loader',
					options: {
						sourceType: 'unambiguous',
						presets: [
							[
								'@babel/env',
								{
									useBuiltIns: 'usage',
									corejs: '3.37',
									targets: { chrome: 79 }, // corresponds to webOS 6
								},
							],
							['@babel/react'],
							['@babel/typescript', { onlyRemoveTypeImports: true }],
						],
						plugins: [
							['transform-typescript-metadata'],
							['@babel/plugin-proposal-decorators', { version: 'legacy' }],
							['@babel/plugin-transform-class-properties'],
						],
					},
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
			'process.env.APP_ID': JSON.stringify(id),
		}),
		new MiniCssExtractPlugin(),
		new HtmlWebpackPlugin({
			template: './src/app/index.html',
		}),
		new CopyPlugin({
			patterns: [
				{
					from: '**/*',
					context: 'manifests/app',
					priority: 10,
				},
				{
					from: '**/*.json',
					context: 'manifests/app',
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
	],
});

export default config;
