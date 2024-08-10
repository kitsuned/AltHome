import type { Service } from './bus';

export abstract class Routine {
	public readonly id: string;

	protected constructor(protected readonly service: Service) {}

	public abstract apply(): PromiseLike<void> | void;
}
