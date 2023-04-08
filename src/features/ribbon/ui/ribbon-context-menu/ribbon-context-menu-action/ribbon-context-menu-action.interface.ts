import { MenuAction } from '../../../lib/ribbon';

export type RibbonContextMenuActionProps = {
	action: MenuAction;

	onSelect(action: MenuAction): void;
};
