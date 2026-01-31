// TODO
type TriggerZone = any;

export type RibbonScrollTriggerProps = {
	hiddenEdge: TriggerZone;
	onTrigger(zone: TriggerZone): void;
};
