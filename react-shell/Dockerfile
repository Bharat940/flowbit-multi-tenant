FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4001

CMD ["npx", "webpack", "serve", "--port", "4001", "--host", "0.0.0.0"]
