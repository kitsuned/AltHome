import { container } from '../core/di';

import { launcherModule } from './launcher';
import { lifecycleManagerModule } from './lifecycle-manager';
import { settingsModule } from './settings';
import { systemInfoModule } from './system-info';

container.loadSync(systemInfoModule, settingsModule, lifecycleManagerModule, launcherModule);
