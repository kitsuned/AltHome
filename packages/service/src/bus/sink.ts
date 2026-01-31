class Deferred<T> {
	public promise: Promise<T>;
	public resolved: boolean = false;

	private resolver!: (value: T | PromiseLike<T>) => void;

	public constructor() {
		this.promise = new Promise(resolve => {
			this.resolver = resolve;
		});
	}

	public resolve(value: T | PromiseLike<T>) {
		this.resolved = true;
		this.resolver(value);
	}
}

export class AsyncSink<T> implements AsyncIterator<T> {
	private queue: T[] = [];
	private backPressure: Deferred<T> = new Deferred<T>();

	public [Symbol.asyncIterator](): AsyncIterator<T> {
		return this;
	}

	public push(value: T) {
		if (!this.backPressure.resolved) {
			this.backPressure.resolve(value);
			return;
		}

		this.queue.push(value);
	}

	public async next(): Promise<IteratorResult<T>> {
		const value =
			this.queue.length === 0 ? await this.backPressure.promise : this.queue.shift()!;

		this.backPressure = new Deferred<T>();

		return { done: false, value };
	}
}
