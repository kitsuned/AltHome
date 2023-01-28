import fs from 'fs';

import { Logger } from './logger';
import { lsControl } from './luna';

const logger = new Logger('elevator');

const CLIENT_PERMISSIONS_PATH = `/var/luna-service2-dev/client-permissions.d/${process.env.APP_ID}.all.json`;
const MANIFEST_PATH = `/var/luna-service2-dev/manifests.d/${process.env.APP_ID}.json`;

const addExtraClientPermissions = () => {
	if (fs.existsSync(CLIENT_PERMISSIONS_PATH)) {
		logger.info('client permissions file already exists');
		return;
	}

	fs.writeFileSync(CLIENT_PERMISSIONS_PATH, JSON.stringify({
		[`${process.env.APP_ID}-*`]: [
			'all',
		],
	}));

	logger.info(`created client permissions file: ${CLIENT_PERMISSIONS_PATH}`);
};

const updateManifest = () => {
	const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH).toString('utf8'));

	manifest.clientPermissionFiles ??= [];
	manifest.clientPermissionFiles.push(CLIENT_PERMISSIONS_PATH);

	fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest));

	logger.info(`updated manifest file: ${MANIFEST_PATH}`);
};

export const elevate = () => {
	addExtraClientPermissions();
	updateManifest();

	lsControl('scan-volatile-dirs');
	lsControl('scan-services');
};
