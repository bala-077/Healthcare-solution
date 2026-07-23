FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose the API port (from .env or default to 5000)
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
