import { inject, injectable } from 'inversify';

import type { LaunchPointInput } from '../api/launch-point.interface';

import { LauncherService } from './launcher.service';

type NonFunctionPropertyNames<T> = {
	[K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

@injectable()
export class LaunchPoint {
	appId!: string;
	title!: string;
	launchPointId!: string;

	builtin!: boolean;
	removable!: boolean;

	icon!: string;
	iconColor!: string;

	params: Record<string, any> = {};

	public constructor(
		@inject(LauncherService) private readonly launcherService: LauncherService,
	) {}

	public launch(): Promise<any> {
		return this.launcherService.launch(this);
	}

	public move(shift: number) {
		this.launcherService.move(this, shift);
	}

	public show() {
		this.launcherService.show(this);
	}

	public hide() {
		this.launcherService.hide(this);
	}

	public uninstall() {
		return this.launcherService.uninstall(this);
	}

	public apply(snapshot: LaunchPointInput): LaunchPoint {
		const {
			title,
			launchPointId,
			removable,
			iconColor,
			builtin = false,
			params = {},
		} = snapshot;

		return Object.assign(this, {
			appId: snapshot.id,
			icon: LaunchPoint.normalizeIcon(snapshot),
			title,
			launchPointId,
			removable,
			iconColor,
			builtin,
			params,
		} satisfies NonFunctionProperties<LaunchPoint>);
	}

	private static normalizePath(path: string) {
		return path.startsWith('/') ? `./root${path}` : path;
	}

	private static normalizeIcon(snapshot: LaunchPointInput) {
		return LaunchPoint.normalizePath(
			snapshot.mediumLargeIcon ||
				snapshot.largeIcon ||
				snapshot.extraLargeIcon ||
				snapshot.icon,
		);
	}
}
