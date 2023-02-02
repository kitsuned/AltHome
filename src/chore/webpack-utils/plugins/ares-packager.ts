import { spawn } from 'node:child_process';
import { resolve, dirname } from 'node:path';

import { Compilation, Compiler, WebpackError, WebpackPluginInstance } from 'webpack';

export class AresPackagerPlugin implements WebpackPluginInstance {
	static readonly pluginName = 'ares-packager';

	apply(compiler: Compiler) {
		compiler.hooks.afterEmit.tapAsync(AresPackagerPlugin.pluginName, (compilation: Compilation, callback) => {
			const logger = compilation.getLogger(AresPackagerPlugin.pluginName);

			const binary = resolve(dirname(require.resolve('@webosose/ares-cli')), 'ares-package.js');
			const process = spawn(binary, [compiler.outputPath, '-o', compiler.outputPath]);

			process.stdout.on('data', data => {
				logger.info(data.toString().trim());
			});

			process.stderr.on('data', data => {
				logger.error(data.toString().trim());
			});

			process.on('exit', code => {
				if (code) {
					compilation.errors.push(
						new WebpackError(`ares-package: exited with code ${code}`),
					);
				}

				callback();
			});
		});
	}
}
