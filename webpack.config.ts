import { hoc } from '@webosbrew/webos-packager-plugin';

import { id, version } from './package.json';
import app from './webpack.app';

export default hoc({
	id,
	version,
	app,
});
