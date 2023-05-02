import React from 'react';

import { MenuAction } from 'features/ribbon';

export type RibbonContextMenuProps = {
	cardRef: React.MutableRefObject<HTMLElement | null>;
	removable?: boolean;

	onSelect(action: MenuAction): void;
};
