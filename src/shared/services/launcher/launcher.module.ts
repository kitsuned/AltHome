import { ContainerModule } from 'inversify';

import { LauncherService } from './model/launcher.service';
import {
	AppManagerProvider,
	InputProvider,
	InternalProvider,
	LaunchPointsProvider,
} from './providers';

export const launcherModule = new ContainerModule(bind => {
	bind(LauncherService).toSelf();

	bind(LaunchPointsProvider).to(InputProvider);
	bind(LaunchPointsProvider).to(AppManagerProvider);
	bind(LaunchPointsProvider).to(InternalProvider);
});
