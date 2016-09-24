#!/usr/bin/bash
startPhantom () {
cd /var/www/front_end/app/
/var/www/front_end/node_modules/phantomjs/lib/phantom/bin/phantomjs --disk-cache=no /var/www/front_end/app/angular-seo-server.js 10050 http://localhost:3000 &
RESULT=$?
if [ $RESULT -eq 0 ]; then
  echo 'PhantomJS server started OK'
else
  echo 'PhantomJS server failed to start'
fi
echo -e '\n'
}

# start the server

startPhantom
