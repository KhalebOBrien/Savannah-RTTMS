# Stage 1: Build the backend
FROM node:16-alpine AS backend-build

WORKDIR /app/backend

# Copy backend files
COPY ./backend/package*.json ./
RUN yarn

# Copy backend source files
COPY ./backend .

# Build the backend
RUN yarn build

# Stage 2: Build the frontend
FROM node:16-alpine AS frontend-build

WORKDIR /app/frontend

# Copy frontend files
COPY ./frontend/package*.json ./
RUN yarn

# Copy frontend source files
COPY ./frontend .

# Build the frontend
RUN yarn build

# Stage 3: Setup Nginx and combine both frontend and backend
FROM nginx:alpine

# Copy Nginx configuration
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy backend and frontend build outputs
COPY --from=backend-build /app/backend/dist /app/backend
COPY --from=frontend-build /app/frontend/dist /app/frontend

# Expose the port Nginx is using
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
