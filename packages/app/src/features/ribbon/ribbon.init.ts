import { container } from 'shared/core/di';

import {
	appDrawerModule,
	contextMenuModule,
	keyboardModule,
	ribbonModule,
	scrollModule,
} from './services';

container.load(appDrawerModule, contextMenuModule, keyboardModule, scrollModule, ribbonModule);
