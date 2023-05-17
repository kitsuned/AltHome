import { container } from '@di';

import {
	appDrawerModule,
	contextMenuModule,
	keyboardModule,
	ribbonModule,
	scrollModule,
} from './services';

container.load(appDrawerModule, contextMenuModule, keyboardModule, scrollModule, ribbonModule);
