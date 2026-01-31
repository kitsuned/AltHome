import { container } from 'shared/core/di';

import {
	appDrawerModule,
	contextMenuModule,
	keyboardModule,
	ribbonModule,
	scrollModule,
} from './services';

container.loadSync(appDrawerModule, contextMenuModule, keyboardModule, scrollModule, ribbonModule);
