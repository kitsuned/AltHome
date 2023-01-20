#!/usr/bin/env sh

KEYFILTERS_FACTORY=/var/althome/initial-keyfilters.json

if [ ! -f $KEYFILTERS_FACTORY ]; then
  echo "Factory file not found."
  exit 1
fi

luna-send -n 1 luna://com.webos.service.config/setConfigs "$(cat $KEYFILTERS_FACTORY)"
