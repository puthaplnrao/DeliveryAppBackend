# Use official Node.js 20 image
FROM node:20

# Set working directory
WORKDIR /app

# Copy dependency files first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Expose the application port
EXPOSE 1124

# Start the application
CMD ["npm", "start"]