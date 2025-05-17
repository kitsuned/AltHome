import type { Service } from './bus';

export abstract class Routine {
	public abstract readonly id: string;

	public constructor(protected readonly service: Service) {}

	public abstract apply(): PromiseLike<void> | void;
}
