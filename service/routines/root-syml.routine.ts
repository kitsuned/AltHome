import { promises } from 'fs';
import { join } from 'path';

import { APP_ROOT_DIR } from '../environment';
import type { Routine } from '../routine';

class InvalidLinkError extends Error {
	public constructor(message) {
		super(message);

		Object.setPrototypeOf(this, InvalidLinkError.prototype);
	}
}

export class RootSymlRoutine implements Routine {
	public readonly id = 'root-syml';

	private readonly linkPath = join(APP_ROOT_DIR, 'root');
	private readonly linkTarget = '/';

	public async apply() {
		try {
			const stat = await promises.lstat(this.linkPath);

			if (!stat.isSymbolicLink()) {
				throw new InvalidLinkError(`${this.linkPath} is not a symbolic link`);
			}

			const target = await promises.readlink(this.linkPath);

			if (target !== this.linkTarget) {
				throw new InvalidLinkError(`${this.linkTarget} points to ${target}`);
			}
		} catch (e) {
			if (e instanceof InvalidLinkError) {
				console.log('unlinking broken symlink:', e.message);

				await promises.unlink(this.linkPath);
			}

			await promises.symlink(this.linkTarget, this.linkPath);

			console.log(`created symlink ${this.linkPath} -> ${this.linkTarget}`);
		}
	}
}
