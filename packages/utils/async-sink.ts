import { Deferred } from './deffered';

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
