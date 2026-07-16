FROM jenkins/jenkins:lts-alpine

USER root

RUN apk add --no-cache docker-cli docker-compose go nodejs npm

# Prevent Git security directory ownership checks from causing 'not in a git directory' errors
RUN git config --global --add safe.directory "*"


