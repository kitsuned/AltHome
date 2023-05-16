import type { LunaMessage } from '../../luna';
import type { systemInfoKeys } from '../lib/system-info-keys.lib';

export type SystemInfo = Record<(typeof systemInfoKeys)[number], string>;

export type SystemInfoMessage = LunaMessage<SystemInfo>;
