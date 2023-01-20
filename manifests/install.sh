#!/usr/bin/env sh

cd /media/developer/apps/usr/palm/applications/com.kitsuned.althome || exit 1

# hacky way to get icons!
ln -sfv / ./root

# set permissions
cp -rv ./luna/* /var/luna-service2-dev

ls-control scan-volatile-dirs
ls-control scan-services

./keyfilter/apply.sh
