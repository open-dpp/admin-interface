# Stage 1: Build the application
FROM node:22-alpine AS build-stage

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./
# If you're using Yarn, copy yarn.lock instead
# COPY yarn.lock ./

# Install dependencies
RUN npm install
# If you're using Yarn
# RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the application
CMD npm run dev -- --host