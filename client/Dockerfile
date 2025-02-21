# Use an official Node.js image as a base
FROM node:latest AS build

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the source code
COPY . .

# Since we will proxy request from /api set it as the backend url
ENV VITE_ENV=docker
ENV VITE_BACKEND_URL=/api

# Build the React app
RUN npm run build

# Start a new image for serving the static files with Nginx
FROM nginx:alpine

# Copy the build output from the previous step
COPY --from=build /app/dist /usr/share/nginx/html

# copy configuration Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Set the default value for nginx proxy destination
ARG BACKEND_URL=http://backend:3001/api
RUN sed -i "s|<BACKEND_URL>|${BACKEND_URL}|g" /etc/nginx/conf.d/default.conf

# Expose port 80 for the web server
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

