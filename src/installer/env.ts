import fs from 'fs';
import { join } from 'path';

import { Logger } from './logger';

const logger = new Logger('env');

const APP_ROOT = `/media/developer/apps/usr/palm/applications/${process.env.APP_ID}`;

const WORK_DIRS = [
	'/var/althome/keyfilters',
	'/var/althome/confstore',
];

const createWorkDirs = () => {
	for (const dir of WORK_DIRS) {
		if (fs.existsSync(dir)) {
			logger.info(`${dir}: already exists`);
			continue;
		}

		fs.mkdirSync(dir, { recursive: true });

		logger.info(`${dir}: created`);
	}
};

const createSymlinkToRoot = () => {
	const symlinkPath = join(APP_ROOT, 'root');

	if (fs.existsSync(symlinkPath)) {
		if (fs.readlinkSync(symlinkPath) === '/') {
			logger.info('root symlink already exists');
			return;
		}

		fs.rmSync(symlinkPath);
		logger.info(`removed invalid file at ${symlinkPath}`);
	}

	fs.symlinkSync('/', symlinkPath);
	logger.info('created symlink to root');
};

export const initEnv = () => {
	createSymlinkToRoot();
	createWorkDirs();
};
