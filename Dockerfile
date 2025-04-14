# Use Node.js LTS as base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy server dependencies and install them
COPY server/package*.json ./server/
RUN cd server && npm install

# Copy the full server code
COPY server ./server

# Install TypeScript globally
RUN npm install -g typescript

# Build the TypeScript code
RUN cd server && npm run build

# Change directory to the server folder
WORKDIR /app/server

# Expose the port (make sure your app uses process.env.PORT)
EXPOSE 5000

# Start the app
CMD ["node", "dist/index.js"]
