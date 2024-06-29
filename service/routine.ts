export interface Routine {
	readonly id: string;

	apply(): Promise<void>;
}
