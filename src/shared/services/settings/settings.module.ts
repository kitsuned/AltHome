import { ContainerModule } from 'inversify';

import { SettingsService } from './model/settings.service';

export const settingsModule = new ContainerModule(bind => {
	bind(SettingsService).toSelf();
});
