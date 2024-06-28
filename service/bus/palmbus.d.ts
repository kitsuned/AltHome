// eslint-disable-next-line max-classes-per-file
declare namespace Palmbus {
	class Handle {
		public constructor(busId: string);

		public call(uri: string, serialized: string): Call;

		public registerMethod(category: string, method: string): void;

		public addListener(event: 'request', listener: (message: Message) => any): this;
		public addListener(event: 'cancel', listener: (message: Message) => any): this;
	}

	class Message {
		public constructor(serialized: string, handle: Handle);

		public category(): string;

		public method(): string;

		public isSubscription(): boolean;

		public uniqueToken(): string;

		public token(): string;

		public payload(): string;

		public respond(serialized: string): string;
	}

	class Call {
		public addListener(event: 'response', listener: (message: Message) => any): this;
	}
}

declare module 'palmbus' {
	export = Palmbus;
}
