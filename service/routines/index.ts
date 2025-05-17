import type { Service } from '../bus';
import type { Routine } from '../routine';

import { KeyfilterRoutine } from './keyfilter.routine';
import { RootSymlRoutine } from './root-syml.routine';

type RoutineCtor = {
	new (service: Service): Routine;
};

export const routines: RoutineCtor[] = [RootSymlRoutine, KeyfilterRoutine];
