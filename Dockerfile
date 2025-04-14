# Use Node.js LTS as base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy server package files and install dependencies
COPY server/package*.json ./server/
RUN cd server && npm install

# Copy the entire server folder
COPY server ./server

# Install TypeScript globally
RUN npm install -g typescript

# Build the TypeScript code
RUN cd server && npm run build

# Set working directory to built server code
WORKDIR /app/server

# Expose the port your server listens on
EXPOSE 5000

# Start the app
CMD ["node", "dist/index.js"]
