import { ContainerModule } from 'inversify';

import { ContextMenuService } from './context-menu.service';

export const contextMenuModule = new ContainerModule(bind => {
	bind(ContextMenuService).toSelf();
});
