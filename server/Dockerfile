FROM node:20-alpine3.19
WORKDIR /server
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]