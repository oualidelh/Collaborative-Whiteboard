FROM node:18

WORKDIR /app

# Copy package.json files and install dependencies
COPY server/package*.json ./server/

# Install deps (including dev ones)
RUN cd server && npm install

# Copy entire server folder
COPY server ./server

# Optional: install typescript globally to avoid tsc errors
RUN npm install -g typescript

# Compile TypeScript using script instead of npx
RUN cd server && npm run build

EXPOSE 4000

CMD ["node", "server/dist/index.js"]
