import { MenuAction } from 'features/ribbon';

export type RibbonContextMenuActionProps = {
	action: MenuAction;

	onSelect(action: MenuAction): void;
};
