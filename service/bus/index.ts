import palmbus from 'palmbus';

import { SERVICE_ID } from '../environment';

import { Message } from './message';
import { AsyncSink } from './sink';

type Executor<T, N extends Record<string, any>> = (body: T) => AsyncGenerator<N>;

const extractMethodPath = (path: string): [string, string] => {
	const lastSlashIndex = path.lastIndexOf('/');

	if (lastSlashIndex <= 0) {
		return ['/', path.slice(1)];
	}

	return [path.slice(0, lastSlashIndex), path.slice(lastSlashIndex + 1)];
};

export class Service {
	private readonly handle: palmbus.Handle;
	private readonly serviceId: string;

	private readonly methods: Map<string, Executor<any, any>> = new Map();

	public constructor(serviceId?: string) {
		this.serviceId = serviceId ?? SERVICE_ID;

		this.handle = new palmbus.Handle(this.serviceId);

		this.handle.addListener('request', this.handleRequest.bind(this));

		setTimeout(() => {
			// TODO do something, huh
		}, 10000);
	}

	public register<T, N extends Record<string, any> = Record<string, any>>(
		method: string,
		executor: Executor<T, N>,
	) {
		this.handle.registerMethod(...extractMethodPath(method));

		this.methods.set(method, executor);
	}

	public async *subscribe<T>(
		uri: string,
		params: Record<string, any> = {},
	): AsyncGenerator<T, null> {
		const sink = new AsyncSink<T>();
		const subscription = this.handle.subscribe(uri, JSON.stringify(params));

		subscription.addListener('response', pMessage => {
			sink.push(Message.fromPalmMessage(pMessage).payload);
		});

		try {
			yield* sink;
		} finally {
			subscription.cancel();
		}
	}

	public async oneshot<T>(uri: string, params: Record<string, any> = {}): Promise<T> {
		const generator = this.subscribe<T>(uri, params);

		const { value } = await generator.next();

		await generator.return(null);

		return value!;
	}

	private handleRequest(pMessage: palmbus.Message): void {
		const message = Message.fromPalmMessage(pMessage);

		Promise.resolve()
			.then<any>(() => message.payload)
			.then(async body => {
				const impl = this.methods.get(message.method)!;

				return this.drainExecutor(impl(body), message);
			})
			.catch(e => {
				console.error('Failed to handle message:', e);

				message.respond({
					returnValue: false,
					errorCode: -1,
					errorText: e instanceof Error ? e.message : String(e),
				});
			});
	}

	private async drainExecutor(generator: ReturnType<Executor<any, any>>, message: Message) {
		const isSubscription = message.payload.subscribe === true;

		let it: IteratorResult<any>;

		do {
			it = await generator.next();

			if (isSubscription || it.done) {
				message.respond({ returnValue: true, ...it.value });
			}
		} while (!it.done);
	}
}
