#!/bin/bash

APP_PATH=/home/ubuntu/app
JAR_PATH=$APP_PATH/build/libs/*.jar
JAR_NAME=$(basename $JAR_PATH)
CONFIG_PATH=/home/ubuntu/config/application-dev.yml

OLD_VERSION_PID="$(pgrep -f $JAR_NAME)"
LOG_PATH=/home/ubuntu/app-log

if [ -n "$(netstat -nlpt | grep 8081)" ]; then
  DEPLOY_PORT=8082
else
  DEPLOY_PORT=8081
fi

#new version start
nohup java -jar -Dserver.port=$DEPLOY_PORT -Dspring.config.location=$CONFIG_PATH $JAR_PATH ${JAR_PATH} 1>>$LOG_PATH/app-log.out 2>>$LOG_PATH/err-log.out &
sleep 30

#health check...
if [ -n "$(netstat -nlpt | grep ${DEPLOY_PORT})" ]; then
  echo "new version deploy is completed"
else
  echo "new version is not running"
  exit 1
fi

#if health check is successful, kill old version
if [ -n "${OLD_VERSION_PID}" ]; then
  sudo kill -9 $OLD_VERSION_PID
fi

#switch nginx proxy pass to DEPLOY_PORT
echo "set \$service_url http://127.0.0.1:${DEPLOY_PORT};" |sudo tee /etc/nginx/conf.d/service-url.inc
sudo service nginx reload