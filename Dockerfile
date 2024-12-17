# Stage 1: Build the application
FROM node:22-alpine AS build-stage

ARG VITE_KEYCLOAK_ROOT="http://localhost:20000"
ENV VITE_KEYCLOAK_ROOT=$VITE_KEYCLOAK_ROOT
ARG VITE_API_ROOT="http://localhost:20005"
ENV VITE_API_ROOT=$VITE_API_ROOT
ARG VITE_ADMIN_ROOT="http://localhost:20004"
ENV VITE_ADMIN_ROOT=$VITE_ADMIN_ROOT
ARG VITE_VIEW_ROOT_URL="http://localhost:20009"
ENV VITE_VIEW_ROOT_URL=$VITE_VIEW_ROOT_URL

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
