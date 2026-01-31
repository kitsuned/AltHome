import type { Service } from '../bus';
import type { Routine } from '../routine';

import { KeyfilterRoutine } from './keyfilter.routine';
import { KillHomeRoutine } from './kill-home.routine';
import { LunaAcgFixupRoutine } from './luna-acg-fixup.routine';
import { MemoryManagerRoutine } from './memory-manager.routine';
import { PreloadManagerRoutine } from './preload.routine';
import { RootSymlRoutine } from './root-syml.routine';

type RoutineCtor = {
	new (service: Service): Routine;
};

export const routines: RoutineCtor[] = [
	LunaAcgFixupRoutine,
	RootSymlRoutine,
	KeyfilterRoutine,
	MemoryManagerRoutine,
	PreloadManagerRoutine,
	KillHomeRoutine,
];
