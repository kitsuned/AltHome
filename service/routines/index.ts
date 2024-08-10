import type { Routine as AbstractRoutine } from '../routine';

import { KeyfilterRoutine } from './keyfilter.routine';
import { RootSymlRoutine } from './root-syml.routine';

type Routine = typeof AbstractRoutine;

export const routines: Routine[] = [RootSymlRoutine, KeyfilterRoutine];
