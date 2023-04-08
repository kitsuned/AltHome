import { LaunchPoint } from 'shared/services/launcher';

export type RibbonAppDrawerItemProps = {
	launchPoint: LaunchPoint;

	onSelect(lp: LaunchPoint): void;
};
