# Dockerfile

FROM node:23-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Explicitly expose the port
EXPOSE 3000

# Use the PORT environment variable for Aptible
CMD ["node", "server.js"]
