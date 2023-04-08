export type LaunchPoint = {
	id: string;
	title: string;

	removable: boolean;
	iconColor: string;
	largeIcon: string;

	params?: Record<string, any>;
};
