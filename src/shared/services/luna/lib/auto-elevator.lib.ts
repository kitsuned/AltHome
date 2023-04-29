import { LunaMessage } from '../api/luna.api';
import { luna } from '../model/luna.service';

export const requestElevation = async () => {
	const { root } = await luna<{ root: boolean }>(
		'luna://org.webosbrew.hbchannel.service/getConfiguration',
	);

	if (!root) {
		await luna('luna://com.webos.notification/createToast', {
			message: '[AltHome] Check root status!',
		});

		return;
	}

	await luna('luna://com.webos.notification/createToast', {
		message: '[AltHome] Getting things ready…',
	});

	await luna('luna://org.webosbrew.hbchannel.service/exec', {
		command:
			'/media/developer/apps/usr/palm/applications/com.kitsuned.althome/service --self-elevation',
	});

	window.close();
};

export const verifyMessageContents = (message: LunaMessage) => {
	if (!message.returnValue && message.errorText?.startsWith('Denied method call')) {
		void requestElevation();
	}
};
