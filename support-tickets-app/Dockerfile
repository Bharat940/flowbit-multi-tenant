FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3100

CMD ["npx", "webpack", "serve", "--port", "3100", "--host", "0.0.0.0"]
