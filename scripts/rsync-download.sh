#!/bin/bash 
rsync --quiet --archive --update --times --whole-file --no-motd \
  --exclude=".keep" --include "*.asc"  --remove-source-files \
  myserver.com:letterbox/data/ /home/steve/secrets/   \
  > /var/log/secret-letterbox-sync.log 2>&1
