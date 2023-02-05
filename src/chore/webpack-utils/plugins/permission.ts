import { open } from 'node:fs/promises';
import { join } from 'node:path';

import { Compiler, WebpackPluginInstance } from 'webpack';

export class PermissionPlugin implements WebpackPluginInstance {
	static readonly pluginName = 'permission-plugin';
	private readonly shebangMagicHeader = 0x2123;
	private readonly mask = 0o755;

	apply(compiler: Compiler) {
		compiler.hooks.afterEmit.tapPromise(PermissionPlugin.pluginName, async (compilation) => {
			if (compilation.options.mode !== 'production') {
				return;
			}

			for (const asset of compilation.getAssets()) {
				const path = join(compiler.outputPath, asset.name);

				const handle = await open(path);
				const { buffer } = await handle.read({
					length: 2,
				});
				const header = buffer.readUInt16LE();

				if (header === this.shebangMagicHeader) {
					await handle.chmod(this.mask);
				}

				await handle.close();
			}
		});
	}
}
