FROM node:12
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
USER node
RUN npm run client:install
RUN npm run client:build -y
RUN npm run start

# Если вы создаете сборку для продакшн
# RUN npm ci --only=production
# копируем исходный код


EXPOSE 5000
CMD [ "npm", "run", "start" ]