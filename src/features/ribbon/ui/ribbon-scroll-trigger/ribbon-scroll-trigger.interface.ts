import type { TriggerZone } from '../../lib/zone';

export type RibbonScrollTriggerProps = {
	hiddenEdge: TriggerZone;
	onTrigger(zone: TriggerZone): void;
};
