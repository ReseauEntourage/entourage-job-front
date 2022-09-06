# ==== CONFIGURE =====
# Use a Node 16 base image
FROM node:14.2-alpine AS dev
# Set the working directory to /src inside the container
WORKDIR /src
# Copy src files
COPY . .
# Install dependencies
RUN npm i --omit=dev --ignore-scripts --legacy-dep-peers
# Set the env to "dev"
ENV NODE_ENV dev
# Expose the port on which the app will be running (3000 is the default that `serve` uses)
EXPOSE 3001
# Start the app
CMD [ "npx", "dev" ]