import { container } from '@di';

import { lrudModule, ribbonModule, scrollModule } from './services';

container.load(lrudModule, scrollModule, ribbonModule);
