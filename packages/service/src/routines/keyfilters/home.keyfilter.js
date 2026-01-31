/* eslint-disable */
/**
 * This file is injected into the `keyfilters`, surface-manager keycodes handlers.
 *
 * It prepends the original HOME key handler (`launchHomeApp`) with custom logic.
 */

const homeKeys = [Qt.Key_Super_L, Qt.Key_Meta, Qt.Key_Menu];

let isAltHomeInstalled = false;

/**
 * Handle key press
 * If AltHome is not installed or other key is pressed — continue to next policy
 * Otherwise, launch AltHome then stop event propagation
 */
function handleHomeKey(key) {
	if (!isAltHomeInstalled || homeKeys.indexOf(key) === -1) {
		return KeyPolicy.NextPolicy;
	}

	applicationManager.launch(__APP_ID__, JSON.stringify({ key }));

	return KeyPolicy.Accepted;
}

/**
 * Handle package info response to check is AltHome installed
 */
function cb_handleAltHomeAppInfo(payload) {
	const response = JSON.parse(payload);

	if (response.returnValue && response.appInfo) {
		isAltHomeInstalled = true;
	}
}

/**
 * StarfishKeyFilterLoader.qml calls exported init function after keyfilter load
 * Keyfilter will check if AltHome is actually installed
 */
function init() {
	lunaCall.send(
		'com.webos.service.applicationmanager',
		'/getAppInfo',
		JSON.stringify({ id: __APP_ID__ }),
		cb_handleAltHomeAppInfo,
	);
}
