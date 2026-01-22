import { spawn } from 'child_process';
import { promises } from 'fs';

export const readFile = (path: string): Promise<string> =>
	promises.readFile(path, { encoding: 'utf8' });

export const writeFile = (path: string, content: string): Promise<void> =>
	promises.writeFile(path, content, { encoding: 'utf8' });

export const readJson = async <T>(path: string): Promise<T> => JSON.parse(await readFile(path));

export const writeJson = <T>(path: string, content: T): Promise<void> =>
	writeFile(path, JSON.stringify(content));

// configd merges all layers into /var/preferences/configd_db.json
// and keeps user overrides in /var/preferences/configd_factory_db.json
// P.S. JSON is too big to memoize it...
export const readConfigd = async <T, K extends string = string>(key: K): Promise<T> =>
	(await readJson<Record<K, T>>('/var/preferences/configd_db.json'))[key];

export const asyncSpawn = (bin: string, args: string[] = []): Promise<void> =>
	new Promise((resolve, reject) => {
		const process = spawn(bin, args, { stdio: 'inherit' });

		process.on('close', resolve);

		process.on('error', reject);
	});

export const restartService = (service: string) =>
	asyncSpawn('systemctl', ['--no-block', 'restart', service]);

export const killProcess = (processName: string) =>
	asyncSpawn('killall', [processName]).catch(() => null);
