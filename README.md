# Real-Time Task Management System

This is a **Task Management System** backend built with **Node.js**, **TypeScript**, **MongoDB**, and following the **Hexagonal Architecture**. It includes **authentication** (with JWT) and **CRUD operations** for tasks. The system also includes a **WebSocket** mechanism to notify the frontend when the user updates a task.

## Table of Contents
1. [Setup Instructions](#setup-instructions)
2. [API Documentation](#api-documentation)
3. [Explanation of Architectural Decisions](#explanation-of-architectural-decisions)
4. [Assumptions and Simplifications](#assumptions-and-simplifications)

---

## Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or later)
- **MongoDB** (v4 or later)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/KhalebOBrien/Savannah-RTTMS.git
   cd Savannah-RTTMS
   ```

2. **Install dependencies**:

   ```bash
   yarn
   ```

3. **Environment Configuration**:

   Create a `.env` file in the root directory and add the following variables:

   ```bash
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   ```

4. **Run the application**:

   Start the application in development mode:

   ```bash
   npm run dev
   ```

5. **Run tests**:

   To run the tests using **Vitest**:

   ```bash
   npm run test
   ```

---

## API Documentation

### Authentication

#### 1. **Register a new user**
- **Endpoint**: `/api/v1/auth/register`
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
- **Endpoint**: `/api/v1/auth/login`
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

### Task Management

#### 1. **Create a task**
- **Endpoint**: `/api/v1/tasks`
- **Method**: `POST`
- **Headers**:
  - `Authorization: Bearer <jwt-token>`
- **Body**:
  ```json
  {
    "title": "New Task",
    "description": "Task description",
    "completed": false,
    "userId": "user-id"
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
        "completed": false,
        "userId": "user-id"
      }
    }
  }
  ```

#### 2. **Get a task by ID**
- **Endpoint**: `/api/v1/tasks/:id`
- **Method**: `GET`
- **Headers**:
  - `Authorization: Bearer <jwt-token>`
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Task retrieved successfully",
    "data": {
      "task": {
        "id": "task-id",
        "title": "New Task",
        "description": "Task description",
        "completed": false,
        "userId": "user-id"
      }
    }
  }
  ```

#### 3. **Update a task**
- **Endpoint**: `/api/v1/tasks/:id`
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
        "completed": true,
        "userId": "user-id"
      }
    }
  }
  ```

#### 4. **Delete a task**
- **Endpoint**: `/api/v1/tasks/:id`
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
1. **Domain-Driven Design**: The business logic (such as user registration, task management) is encapsulated in **domain services** and **entities**. These are pure, isolated, and testable components.
   
2. **Ports and Adapters**: 
   - **Ports**: Define interfaces for external services such as repositories (for data persistence) and controllers (for handling HTTP requests).
   - **Adapters**: Provide concrete implementations for these interfaces, including MongoDB for data persistence and Express for HTTP handling.
   
3. **Dependency Injection**: Services are injected into the controllers and other components to reduce coupling and improve testability.

4. **WebSockets**: Used for real-time updates when a task is modified. This is useful for pushing updates to the frontend without constant polling.

5. **Error Handling**: All routes and services follow a structured error-handling mechanism, returning standardized responses.

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

---

Feel free to extend this project as necessary based on your specific requirements!