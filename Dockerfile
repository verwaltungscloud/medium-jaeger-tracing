FROM node:lts
WORKDIR /app
COPY ./package.json .
RUN npm install
COPY . .
EXPOSE 4000
CMD ["node", "./app.js"]