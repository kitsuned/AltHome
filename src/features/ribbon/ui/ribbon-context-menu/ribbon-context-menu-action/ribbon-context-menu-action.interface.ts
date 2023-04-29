import { MenuAction } from 'features/ribbon/lib/ribbon';

export type RibbonContextMenuActionProps = {
	action: MenuAction;

	onSelect(action: MenuAction): void;
};
