declare module '*.source.*' {
	const value: string;
	export = value;
}

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			APP_ID: string;
			SERVICE_ID: string;
		}
	}
}

export {};
