/* eslint-disable */
/*
 * This file is injected into the `keyfilters`, surface-manager keycodes handlers.
 *
 * It overrides the original HOME key handler (`launchHomeApp`) with custom logic,
 * thanks to JavaScript shadowing.
 *
 * The XHR request below checks if AltHome is really installed.
 * If it is not, revert to the original home screen application identifier.
 */

let homeAppId = __APP_ID__;

function launchHomeApp(key) {
	applicationManager.launch(
		homeAppId,
		JSON.stringify({
			activateType: getActivateType(key),
		}),
	);
}

(() => {
	const xhr = new XMLHttpRequest();

	xhr.onreadystatechange = () => {
		if (xhr.status !== 200) {
			homeAppId = 'com.webos.app.home';
		}
	};

	xhr.open(
		'HEAD',
		`file:///media/developer/apps/usr/palm/applications/${__APP_ID__}/appinfo.json`,
	);

	xhr.send();
})();
