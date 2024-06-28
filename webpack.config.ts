import { hoc } from '@webosbrew/webos-packager-plugin';

import { id, version } from './package.json';
import app from './webpack.app';
import service from './webpack.service';

export default hoc({
	id,
	version,
	app,
	services: [service],
});
