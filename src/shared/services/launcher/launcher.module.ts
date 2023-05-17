import { ContainerModule } from 'inversify';

import type { LaunchPointInput, LaunchPointInstance } from './api/launch-point.interface';
import { launchPointFactorySymbol } from './launcher.tokens';
import { LaunchPoint } from './model/launch-point.model';
import { LauncherService } from './model/launcher.service';
import {
	AppManagerProvider,
	InputProvider,
	InternalProvider,
	LaunchPointsProvider,
} from './providers';

export const launcherModule = new ContainerModule(bind => {
	bind(LauncherService).toSelf();
	bind(LaunchPoint).toSelf().inTransientScope();

	bind(launchPointFactorySymbol).toFactory<LaunchPointInstance, [LaunchPointInput]>(
		context => snapshot => context.container.get(LaunchPoint).apply(snapshot),
	);

	bind(LaunchPointsProvider).to(InputProvider);
	bind(LaunchPointsProvider).to(AppManagerProvider);
	bind(LaunchPointsProvider).to(InternalProvider);
});
