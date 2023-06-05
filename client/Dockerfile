

# Base image for Angular CLI
FROM node:14 as builder

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN apt-get update && apt-get install -y npm
RUN npm install

# Copy the frontend files
COPY . .

# Build the frontend
RUN npm run build --prod

# Second stage: Create a lightweight image to serve the frontend
FROM nginx:latest

# Copy the built frontend from the builder stage to the NGINX image
COPY --from=builder /app/dist/client /usr/share/nginx/html

# Expose the port that the frontend listens on
EXPOSE 4200

# Set the startup command
CMD ["nginx", "-g", "daemon off;"]
