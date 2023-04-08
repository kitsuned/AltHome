export type LaunchPoint = {
	id: string;
	title: string;

	removable: boolean;
	iconColor: string;
	icon: string;

	params?: Record<string, any>;
};

export type LaunchPointIconsMixin = {
	icon?: string;
	mediumLargeIcon?: string;
	largeIcon?: string;
	extraLargeIcon?: string;
};
