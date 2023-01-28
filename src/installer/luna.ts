import { spawnSync } from 'child_process';

import { Logger } from './logger';

const logger = new Logger('luna');

export const lunaSend = (uri: string, options: object = {}): any => {
	const { status, stdout } = spawnSync('luna-send', ['-n', '1', uri, JSON.stringify(options)]);

	if (status !== 0) {
		throw new Error('luna-send returned non-zero status');
	}

	return JSON.parse(stdout.toString());
};

export const lsControl = (command: string): void => {
	const { status, stderr, stdout } = spawnSync('ls-control', [command]);

	if (stdout.length) {
		logger.info(stdout.toString().trim());
	}

	if (stderr.length) {
		logger.info(stderr.toString().trim());
	}

	if (status !== 0) {
		throw new Error('ls-control returned non-zero status');
	}
};
