FROM jenkins/jenkins:lts-alpine

USER root

RUN apk add --no-cache docker-cli docker-compose

RUN addgroup -g 984 docker && addgroup jenkins docker

USER jenkins
