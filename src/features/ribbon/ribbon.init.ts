import { container } from '@di';

import { contextMenuModule, keyboardModule, ribbonModule, scrollModule } from './services';

container.load(contextMenuModule, keyboardModule, scrollModule, ribbonModule);
