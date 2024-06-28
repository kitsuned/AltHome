import type palmbus from 'palmbus';

export class Message<T extends Record<string, any> = Record<string, any>> {
	private constructor(private readonly pMessage: palmbus.Message) {}

	public get method(): string {
		return this.pMessage.category() + this.pMessage.method();
	}

	public get payload(): T {
		return JSON.parse(this.rawPayload) as T;
	}

	public get rawPayload(): string {
		return this.pMessage.payload();
	}

	public respond(message: Record<string, any>) {
		this.pMessage.respond(JSON.stringify(message));
	}

	public static fromPalmMessage(pMessage: palmbus.Message) {
		return new Message(pMessage);
	}
}
