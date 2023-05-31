FROM node:18-alpine As development

WORKDIR  /usr/src/app

COPY package*.json ./
COPY npm-shrinkwrap.json ./
COPY .npmrc ./

RUN npm install --global npm@latest
RUN npm ci

COPY --chown=node:node . .

CMD ["npm", "start"]

FROM development as builder

RUN npm run build

FROM node:18-alpine as production

ARG APP_ENV=development
ENV NODE_ENV=${APP_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
COPY npm-shrinkwrap.json ./
COPY .npmrc ./

RUN npm install --global npm@latest
RUN mkdir -p ./node_modules && chown -R node:node ./node_modules

USER node:node

RUN npm ci --omit=dev,optional,peer

COPY --from=builder --chown=node:node /usr/src/app/dist ./dist

EXPOSE 3001

CMD ["node", "dist/main"]
