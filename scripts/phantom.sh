#!/bin/bash

PHBIN=/var/www/front_end/node_modules/phantomjs/lib/phantom/bin/phantomjs
PHOPT=--disk-cache=no
SEOSERVER=/var/www/front_end/app/angular-seo-server.js
SEOPORT=10050
FRONTSERVER=http://localhost:3000


startPhantom () {
`$PHBIN $PHOPT $SEOSERVER $SEOPORT $FRONTSERVER &`
RESULT=$?
if [ $RESULT -eq 0 ]; then
  echo 'PhantomJS server started OK'
else
  echo 'PhantomJS server failed to start'
fi

}

# start the server

startPhantom