export type LunaErrorMessage = {
	returnValue: false;
	errorCode?: number;
	errorText?: string;
};

export type LunaMessage<T extends Record<string, any> = {}> = LunaErrorMessage | (T & {
	returnValue: true;
});

export type LunaRequestParams<T extends Record<string, any> = Record<string, any>> = T & {
	subscribe?: boolean;
};
