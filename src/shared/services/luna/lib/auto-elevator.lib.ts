import type { LunaMessage } from '../api/luna.api';
import { luna } from '../model/luna.service';

const toast = (message: string) => luna('luna://com.webos.notification/createToast', { message });

// TODO add mutex
export const requestElevation = async () => {
	const { root } = await luna<{ root: boolean }>(
		'luna://org.webosbrew.hbchannel.service/getConfiguration',
	);

	if (!root) {
		await toast('[AltHome] Check root status!');

		return;
	}

	await toast('[AltHome] Preparing service…');

	await luna(`luna://${process.env.SERVICE_ID}/elevate`);

	try {
		await luna(`luna://${process.env.SERVICE_ID}/quit`);
	} catch {
		// should fail with "Message status unknown."
	}

	await new Promise(resolve => setTimeout(resolve, 500));

	await toast('[AltHome] Getting things ready…');

	await luna(`luna://${process.env.SERVICE_ID}/apply`);

	await toast('[AltHome] Setup completed');

	window.close();
};

export const verifyMessageContents = (message: LunaMessage) => {
	if (!message.returnValue && message.errorText?.startsWith('Denied method call')) {
		void requestElevation();
	}
};
