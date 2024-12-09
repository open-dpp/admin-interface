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
RUN npm run build
# If your build script is different, replace 'build' with your script name

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine AS production-stage

# Copy the build output to Nginx's html directory
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]