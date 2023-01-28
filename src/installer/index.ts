import { initEnv } from './env';
import { addAppToKeepAliveList, backupConfigs, rewireKeyfilters } from './configd';
import { elevate } from './elevator';
import { patchKeyfilter, restartInputService } from './keyfilters';

initEnv();

backupConfigs();

elevate();

patchKeyfilter('/usr/lib/qt5/qml/KeyFilters/systemUi.js', '/var/althome/keyfilters/systemUi.js');

addAppToKeepAliveList();

rewireKeyfilters();

restartInputService();
