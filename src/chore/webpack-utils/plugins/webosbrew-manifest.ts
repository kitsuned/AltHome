import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

import { WebpackError, type WebpackPluginInstance, type Compiler } from 'webpack';

type AppInfo = {
	id: string;
	version: string;
	type: string;
	title: string;
};

type Manifest = AppInfo & {
	appDescription: string;
	iconUri: string;
	sourceUrl: string;
	rootRequired: boolean;
	ipkUrl: string;
	ipkHash: {
		sha256: string;
	};
};

type Options = Partial<Manifest> & Pick<Manifest, 'appDescription' | 'iconUri' | 'sourceUrl'>;

export class WebOSBrewManifestPlugin implements WebpackPluginInstance {
	static readonly pluginName = 'webosbrew-manifest-generator';

	constructor(private readonly options: Options) {}

	private async loadAppInfo(compiler: Compiler): Promise<AppInfo> {
		const path = join(compiler.outputPath, 'appinfo.json');
		const buffer = await readFile(path);

		return JSON.parse(buffer.toString('utf8'));
	}

	private async computeIpkInfo(compiler: Compiler): Promise<Pick<Manifest, 'ipkUrl' | 'ipkHash'>> {
		const ipkUrl = (await readdir(compiler.outputPath)).find(x => x.endsWith('.ipk'));

		if (!ipkUrl) {
			throw new WebpackError(`IPK file not found in ${compiler.outputPath}`);
		}

		const buffer = await readFile(join(compiler.outputPath, ipkUrl));

		const hash = createHash('sha256')
			.update(buffer)
			.digest('hex');

		return {
			ipkUrl,
			ipkHash: {
				sha256: hash,
			},
		};
	}

	apply(compiler: Compiler) {
		compiler.hooks.afterEmit.tapPromise(WebOSBrewManifestPlugin.pluginName, async () => {
			const appInfo = await this.loadAppInfo(compiler);
			const ipkInfo = await this.computeIpkInfo(compiler);

			const manifest = <Manifest>{
				id: appInfo.id,
				version: appInfo.version,
				type: appInfo.type,
				title: appInfo.title,
				rootRequired: false,
				...this.options,
				...ipkInfo,
			};

			// we can't emit asset to compilation due to ares-packager lifecycle
			await writeFile(
				join(compiler.outputPath, `${appInfo.id}.manifest.json`),
				JSON.stringify(manifest),
			);
		});
	}
}
