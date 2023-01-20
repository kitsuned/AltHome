export type RibbonHandle = {
	show(): void;
	hide(): void;
};

export type RibbonProps = {
	launchPoints: ReadonlyArray<AltHome.LaunchPoint>;

	onHide?(): void;
};
