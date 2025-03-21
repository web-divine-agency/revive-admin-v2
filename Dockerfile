FROM node:20.18.0-alpine

WORKDIR /var/www/revive-admin-v2

COPY package.json ./

RUN rm -rf node_modules \
  && rm -rf package-lock.json \
  && npm install -g nodemon \
  && npm install

COPY . ./

EXPOSE 3001

CMD ["npm", "run", "dev"]