# Use the official Nginx base image
FROM nginx:1.25.3-alpine3.18

# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the static website files to the appropriate directory
COPY ./public /app
# Expose port 80 for HTTP traffic
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]–