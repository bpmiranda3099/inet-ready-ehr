# Dockerfile

FROM node:23-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Use PORT env for Aptible
EXPOSE $PORT

CMD ["node", "server.js"]
