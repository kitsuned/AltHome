declare module '*.source.*' {
	const value: string;
	export = value;
}

declare const process: {
	env: {
		APP_ID: string;
		SERVICE_ID: string;
	};
};
