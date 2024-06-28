import palmbus from 'palmbus';

import { Message } from './message';

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
		this.serviceId = serviceId ?? process.env.SERVICE_ID!;

		this.handle = new palmbus.Handle(this.serviceId);

		this.handle.addListener('request', this.handleRequest.bind(this));

		setTimeout(() => {
			// TODO do something, huh
		}, 10000);
	}

	public register<T, N>(method: string, executor: Executor<T, N>) {
		this.handle.registerMethod(...extractMethodPath(method));

		this.methods.set(method, executor);
	}

	private handleRequest(pMessage: palmbus.Message): void {
		const message = Message.fromPalmMessage(pMessage);

		Promise.resolve()
			.then<any>(() => message.payload)
			.then(async body => {
				const impl = this.methods.get(message.method);

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
