// TODO
type TriggerZone = never;

export type RibbonScrollTriggerProps = {
	hiddenEdge: TriggerZone;
	onTrigger(zone: TriggerZone): void;
};
