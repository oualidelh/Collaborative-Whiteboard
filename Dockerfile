# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy server package files first to install dependencies
COPY server/package*.json ./server/

# Install server dependencies
RUN cd server && npm install

# Copy the entire server code
COPY server ./server

# Build the TypeScript code
RUN cd server && npx tsc

# Expose the port your server listens on (e.g., 4000)
EXPOSE 4000

# Run the compiled JS output (adjust path if needed)
CMD ["node", "server/dist/index.js"]
