declare global {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	const __DEV__: boolean;

	namespace NodeJS {
		interface ProcessEnv {
			APP_ID: string;
			SERVICE_ID: string;
		}
	}
}

export {};
