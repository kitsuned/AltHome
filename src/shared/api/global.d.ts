declare module '*.module.scss' {
	const content: Record<string, string>;
	export default content;
}

declare const __DEV__: boolean;

declare const process: {
	env: {
		APP_ID: string;
	};
};
