FROM node:18.16.0-alpine3.17
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install
EXPOSE 80
CMD "npm" "start"
