# This is the dockerfile for the AWS amplify image compatible with NodeJS v18
FROM node:18-slim

RUN apt-get update
RUN apt-get install git -y
RUN apt-get install openssh-client -y
RUN apt-get install curl -y

CMD ["/bin/bash"]
