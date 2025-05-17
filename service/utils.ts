import { spawn } from 'child_process';
import { promises } from 'fs';

export const readFile = (path: string): Promise<string> =>
	promises.readFile(path, { encoding: 'utf8' });

export const writeFile = (path: string, content: string): Promise<void> =>
	promises.writeFile(path, content, { encoding: 'utf8' });

export const readJson = async <T>(path: string): Promise<T> => JSON.parse(await readFile(path));

export const writeJson = <T>(path: string, content: T): Promise<void> =>
	writeFile(path, JSON.stringify(content));

export const asyncSpawn = (bin: string, args: string[] = []): Promise<void> =>
	new Promise((resolve, reject) => {
		const process = spawn(bin, args, { stdio: 'inherit' });

		process.on('close', resolve);

		process.on('error', reject);
	});
