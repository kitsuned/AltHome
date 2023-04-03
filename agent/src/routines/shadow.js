var _homeAppId;

function launchHomeApp(key) {
	if (!_homeAppId) {
		return;
	}

	applicationManager.launch(_homeAppId, JSON.stringify({
		activateType: getActivateType(key),
	}));
}

(function () {
	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function () {
		_homeAppId = xhr.status === 200 ? 'com.kitsuned.althome' : 'com.webos.app.home';
	};

	xhr.open('GET', 'file:///media/developer/apps/usr/palm/applications/com.kitsuned.althome/appinfo.json');
	xhr.send();
})();
