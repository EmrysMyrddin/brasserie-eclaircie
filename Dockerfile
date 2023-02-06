FROM node:slim

WORKDIR /usr/src/app

COPY .yarn ./.yarn
COPY yarn.lock package.json .yarnrc.yml ./
RUN yarn

COPY . .
RUN yarn css
RUN yarn build

EXPOSE 3000
ENTRYPOINT yarn start
