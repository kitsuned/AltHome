import React from 'react';

import { MenuAction } from '../../lib/ribbon';

export type RibbonContextMenuProps = {
	cardRef: React.MutableRefObject<HTMLElement | null>;
	removable?: boolean;

	onSelect(action: MenuAction): void;
};
