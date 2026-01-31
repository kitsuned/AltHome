import { hoc } from '@webosbrew/webos-packager-plugin';

import app from '@althome/app/webpack.config';
import service from '@althome/service/webpack.config';

import { id, version } from './package.json';

export default hoc({
	id,
	version,
	app,
	services: [service],
});
