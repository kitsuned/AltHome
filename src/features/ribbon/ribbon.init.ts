import { container } from '@di';

import { keyboardModule, ribbonModule, scrollModule } from './services';

container.load(keyboardModule, scrollModule, ribbonModule);
