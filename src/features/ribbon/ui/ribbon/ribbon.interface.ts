import { LaunchPoint } from 'shared/features/launcher';

export type RibbonHandle = {
	show(): void;
	hide(): void;
};

export type RibbonProps = {
	launchPoints: LaunchPoint[];

	onHide?(): void;
};
