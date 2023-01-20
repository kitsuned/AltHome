#!/usr/bin/env sh

cd "$(dirname "$0")" || exit 1

KEYFILTERS_PATH=/var/althome/keyfilters
KEYFILTERS_FACTORY=/var/althome/initial-keyfilters.json

mkdir -p $KEYFILTERS_PATH
cp -af /usr/lib/qt5/qml/KeyFilters/. $KEYFILTERS_PATH

for p in ./patches/*.patch; do
  patch=$(realpath "$p")
  (cd $KEYFILTERS_PATH && patch < "$patch")
done

CURRENT_KEYFILTERS=$(luna-send -n 1 -q configs luna://com.webos.service.config/getConfigs '{
  "configNames": [
    "com.webos.surfacemanager.keyFilters"
  ]
}')

if [ ! -f $KEYFILTERS_FACTORY ]; then
   echo "$CURRENT_KEYFILTERS" > $KEYFILTERS_FACTORY
fi

luna-send -n 1 luna://com.webos.service.config/setConfigs "$(echo "$CURRENT_KEYFILTERS" | sed -e "s=/usr/lib/qt5/qml/KeyFilters=/var/althome/keyfilters=g")"
