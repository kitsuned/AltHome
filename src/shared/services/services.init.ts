import { container } from '@di';

import { launcherModule } from './launcher';
import { lifecycleManagerModule } from './lifecycle-manager';
import { settingsModule } from './settings';
import { systemInfoModule } from './system-info';

container.load(systemInfoModule, settingsModule, lifecycleManagerModule, launcherModule);
