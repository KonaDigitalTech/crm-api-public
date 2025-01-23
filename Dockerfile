# base image node:20 alpine
FROM node:20-alpine

#Working Directory
WORKDIR /app

# Adds files from the host file system into the Docker container.
COPY . /app

# Install node modules
RUN npm install

#expose a port to allow external access
EXPOSE 3000

# Start mean application
CMD ["npm", "start"]

