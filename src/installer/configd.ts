import fs from 'fs';
import { join } from 'path';

import { Logger } from './logger';
import { lunaSend } from './luna';

const logger = new Logger('configd');

const LUNA_GET_URI = 'luna://com.webos.service.config/getConfigs';
const LUNA_SET_URI = 'luna://com.webos.service.config/setConfigs';
const BACKUP_ROOT = '/var/althome/confstore';
const NS_KEEP_ALIVE = 'com.webos.applicationManager.keepAliveApps';
const NS_KEYFILTERS = 'com.webos.surfacemanager.keyFilters';
const BACKUP_NAMESPACES = [NS_KEEP_ALIVE, NS_KEYFILTERS];

export const backupConfigs = () => {
	for (const namespace of BACKUP_NAMESPACES) {
		const path = join(BACKUP_ROOT, namespace);

		if (fs.existsSync(path)) {
			logger.info(`skip ${namespace}: backup exists`);
			continue;
		}

		const { configs } = lunaSend(LUNA_GET_URI, {
			configNames: [namespace],
		});

		fs.writeFileSync(path, JSON.stringify(configs));

		logger.info(`dumped ${namespace} to ${path}`);
	}
};

export const addAppToKeepAliveList = () => {
	const { configs } = lunaSend(LUNA_GET_URI, {
		configNames: [NS_KEEP_ALIVE],
	});

	if (configs[NS_KEEP_ALIVE].includes(process.env.APP_ID)) {
		logger.info('app id has already been added to keepAlive list');
		return;
	}

	configs[NS_KEEP_ALIVE].push(process.env.APP_ID);

	lunaSend(LUNA_SET_URI, { configs });

	logger.info('added app to keepAlive');
};

export const rewireKeyfilters = () => {
	const { configs } = lunaSend(LUNA_GET_URI, {
		configNames: [NS_KEYFILTERS],
	});

	let patched = false;

	for (const [index, { handler }] of configs[NS_KEYFILTERS].entries()) {
		if (handler === 'handleSystemKeys') {
			configs[NS_KEYFILTERS][index].file = '/var/althome/keyfilters/systemUi.js';
			patched = true;
		}
	}

	if (!patched) {
		throw new Error('system keys handler not found');
	}

	lunaSend(LUNA_SET_URI, { configs });

	logger.info('rewired keyfilters config');
};
