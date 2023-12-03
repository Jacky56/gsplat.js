FROM node:lts-buster

WORKDIR /usr/src/app

COPY package.json ./package.json
COPY package-lock.json ./package-lock.json

RUN npm install
run npm install --save gsplat
COPY . .

EXPOSE 8080

CMD npm run dev