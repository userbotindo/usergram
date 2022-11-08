FROM node:18-bullseye-slim

ENV NODE_ENV=production
WORKDIR /usergram

COPY package.json ./
COPY tsconfig.json ./
COPY .env .env

COPY src ./src

# Do not run prepare hooks on production
RUN npm pkg delete scripts.prepare

RUN npm install
RUN npm run build

RUN rm -rf src

ENTRYPOINT ["/usr/local/bin/node", "dist/index.js"]
CMD ["npm", "start"]
