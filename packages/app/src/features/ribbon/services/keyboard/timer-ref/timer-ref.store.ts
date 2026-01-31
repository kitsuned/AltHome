import { injectable } from 'inversify';

type IsomorphicTimeoutId = ReturnType<typeof setTimeout>;

@injectable()
export class TimerRef {
	public id: IsomorphicTimeoutId | null = null;
	public fired: boolean = false;
}
