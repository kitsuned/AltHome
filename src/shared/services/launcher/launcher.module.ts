import { ContainerModule } from 'inversify';
import type { Factory } from 'inversify';

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

export const launcherModule = new ContainerModule(options => {
	options.bind(LauncherService).toSelf();
	options.bind(LaunchPoint).toSelf().inTransientScope();

	options
		.bind<Factory<LaunchPointInstance, [LaunchPointInput]>>(launchPointFactorySymbol)
		.toFactory(context => snapshot => context.get(LaunchPoint).apply(snapshot));

	options.bind(LaunchPointsProvider).to(InputProvider);
	options.bind(LaunchPointsProvider).to(AppManagerProvider);
	options.bind(LaunchPointsProvider).to(InternalProvider);
});
