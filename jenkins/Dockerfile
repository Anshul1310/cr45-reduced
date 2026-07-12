FROM jenkins/jenkins:lts-alpine

USER root

# Install Docker CLI so Jenkins can run Docker commands
RUN apk add --no-cache docker-cli

USER jenkins
