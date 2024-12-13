# ==== CONFIGURE =====
# Use a Node 16 base image
FROM node:16.17-alpine AS dev
# Set the working directory to /src inside the container
RUN mkdir -p /app
WORKDIR /app
# Copy src files
COPY package*.json /app/
# Install dependencies
RUN npm i --omit=dev --ignore-scripts --legacy-peer-deps
COPY . /app
# Set the env to "dev"
ENV NODE_ENV dev
# Expose the port on which the app will be running (3000 is the default that `serve` uses)
EXPOSE 3001
# Start the app
CMD "pnpm run dev"
