import { container } from '@di';

import { launcherModule } from './launcher';
import { settingsModule } from './settings';

container.load(settingsModule, launcherModule);
