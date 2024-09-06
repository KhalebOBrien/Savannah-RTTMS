# Real-Time Task Management System

This is a full-stack **Task Management System** built with **React (frontend)**, **Node.js/Express (backend)**, **TypeScript**, **Redux for state management**, and **MongoDB** for the database. It includes **authentication** (with JWT) and **CRUD operations** for tasks. The system also includes a **WebSocket** mechanism to notify the frontend when the user updates a task. The frontend and backend are run together using **Docker**.

## Table of Contents

- [Setup Instructions](#setup-instructions)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Running with Docker](#running-with-docker)
- [API Documentation](#api-documentation)
- [Explanation of Architectural Decisions](#explanation-of-architectural-decisions)
- [Assumptions and Simplifications](#assumptions-and-simplifications)

---

## Setup Instructions

### Prerequisites

- **Node.js** (v14 or later)
- **MongoDB** (v4 or later)
- **Docker** (if you want to run the project using Docker)

### Backend Setup

1. **Navigate to the `backend` folder**:

   ```bash
   cd backend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Create a `.env` file** and add the following environment variables:

   ```bash
   MONGODB_URI=mongodb://localhost:27017/taskmanager
   JWT_SECRET=your_secret_key
   ```

4. **Run the backend**:

   ```bash
   npm run dev
   ```

   This will start the backend on **http://localhost:3001**.

### Frontend Setup

1. **Navigate to the `frontend` folder**:

   ```bash
   cd frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run the frontend**:

   ```bash
   npm run dev
   ```

   This will start the frontend on **http://localhost:3000**.

### Running with Docker

You can run both the **frontend** and **backend** using Docker in a single container.

1. **Build the Docker image**:

   In the root directory where your `Dockerfile` is located, run:

   ```bash
   docker build -t task-manager-app .
   ```

2. **Run the Docker container**:

   ```bash
   docker run -p 80:80 task-manager-app
   ```

   This will start an Nginx server that serves the frontend and proxies API requests to the backend. You can access the application on **http://localhost**.

---

## API Documentation

### Authentication Endpoints

#### 1. **Register a user**

- **Endpoint**: `/api/auth/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Registration successful",
    "data": {
      "token": "jwt-token"
    }
  }
  ```

#### 2. **Login a user**

- **Endpoint**: `/api/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Login successful",
    "data": {
      "token": "jwt-token"
    }
  }
  ```

### Task Management Endpoints

#### 1. **Create a task**

- **Endpoint**: `/api/tasks`
- **Method**: `POST`
- **Headers**:
  - `Authorization: Bearer <jwt-token>`
- **Body**:
  ```json
  {
    "title": "New Task",
    "description": "Task description",
    "completed": false
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Task created successfully",
    "data": {
      "task": {
        "id": "task-id",
        "title": "New Task",
        "description": "Task description",
        "completed": false
      }
    }
  }
  ```

#### 2. **Get all tasks**

- **Endpoint**: `/api/tasks`
- **Method**: `GET`
- **Headers**:
  - `Authorization: Bearer <jwt-token>`
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Tasks retrieved successfully",
    "data": [
      {
        "id": "task-id",
        "title": "New Task",
        "description": "Task description",
        "completed": false
      }
    ]
  }
  ```

#### 3. **Update a task**

- **Endpoint**: `/api/tasks/:id`
- **Method**: `PUT`
- **Headers**:
  - `Authorization: Bearer <jwt-token>`
- **Body**:
  ```json
  {
    "title": "Updated Task",
    "description": "Updated description",
    "completed": true
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Task updated successfully",
    "data": {
      "task": {
        "id": "task-id",
        "title": "Updated Task",
        "description": "Updated description",
        "completed": true
      }
    }
  }
  ```

#### 4. **Delete a task**

- **Endpoint**: `/api/tasks/:id`
- **Method**: `DELETE`
- **Headers**:
  - `Authorization: Bearer <jwt-token>`
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Task deleted successfully",
    "data": null
  }
  ```

---

## Explanation of Architectural Decisions

This project follows **Hexagonal Architecture** (also known as Ports and Adapters). The goal of this architecture is to decouple the core business logic from external services (like databases, web frameworks, or messaging systems), making the application more maintainable, testable, and scalable.

### Key Decisions:

1. **Hexagonal Architecture in the Backend**:

   - The backend follows **Hexagonal Architecture** (Ports and Adapters). This separates the business logic (task management and authentication) from external systems like MongoDB or web frameworks (Express).
   - Ports define the interfaces for external systems, and adapters implement those interfaces, ensuring that core business logic can be tested in isolation from the database or HTTP layers.

2. **Domain-Driven Design**: The business logic (such as user registration, task management) is encapsulated in **domain services** and **entities**. These are pure, isolated, and testable components.
3. **Ports and Adapters**:
   - **Ports**: Define interfaces for external services such as repositories (for data persistence) and controllers (for handling HTTP requests).
   - **Adapters**: Provide concrete implementations for these interfaces, including MongoDB for data persistence and Express for HTTP handling.
4. **Dependency Injection**: Services are injected into the controllers and other components to reduce coupling and improve testability.

5. **React with Redux in the Frontend**:

   - The frontend uses **React** with **Redux** for state management. Redux allows for managing authentication, task data, and WebSocket connections centrally in a predictable way.
   - The application uses **React Router** for client-side routing and **React Context API** for simpler global state when Redux is overkill.

6. **Docker**:

   - Docker is used to ensure that both the frontend and backend can run together in a single environment without dependency issues. This allows for easy deployment and consistent environments across development and production.

7. **WebSocket for Real-time Updates**:

   - The application uses **Socket.IO** to provide real-time updates for tasks. Whenever a task is created, updated, or deleted, WebSocket events are emitted, and the frontend updates in real-time without the need for manual refreshes or polling.

8. **Error Handling**: All routes and services follow a structured error-handling mechanism, returning standardized responses.

9. **Monorepo Structure**:
   - The project is organized into a **monorepo** structure with the **frontend** (React) and **backend** (Node.js/Express) in separate directories. This helps in separating concerns and makes it easy to manage each independently while also allowing them to work together seamlessly.

---

## Assumptions and Simplifications

1. **Simplified Authentication**:

   - JWT tokens are used without expiration refresh strategies. For simplicity, the token's validity is controlled entirely by the secret and expiration duration.
   - The user is authenticated via JWT in each API call, and no session or cookie-based authentication is implemented.

2. **Simplified Task Model**:

   - The task model assumes a one-to-one relationship between users and tasks. Tasks are associated directly with a user via `userId`, but no complex permission system or role-based access control is implemented.

3. **No Pagination or Filtering**:

   - The task retrieval endpoints (`GET /tasks`) currently do not implement pagination, filtering, or sorting for simplicity.

4. **MongoDB as the Only Data Store**:

   - MongoDB is assumed to be the only data store in this implementation. No abstraction is made for multiple database support, though the architecture allows for easy extension.

5. **No File Uploads**:
   - This system does not currently support file uploads or attachments for tasks.
