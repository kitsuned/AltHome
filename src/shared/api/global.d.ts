declare module '*.module.css' {
	const content: Record<string, string>;
	export default content;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
declare const __DEV__: boolean;

declare const process: {
	env: {
		APP_ID: string;
	};
};
