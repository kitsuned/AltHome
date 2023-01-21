export type RibbonScrollTriggeredZone = 'left' | 'right' | null;

export type RibbonScrollTriggerProps = {
	onTrigger(zone: RibbonScrollTriggeredZone): void;
};
