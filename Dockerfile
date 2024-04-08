FROM node:18.16.0-alpine3.17
WORKDIR /usr/src/app
COPY . /usr/src/app
EXPOSE 3000
RUN npm install
CMD "npm" "start"
