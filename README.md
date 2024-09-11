# File Sharing System in Node.js

A server-side file sharing system built with Node.js, Express, TypeScript, and AWS S3. This application allows authenticated users to upload, share, retrieve, and delete files, with robust access management and optional features like file renaming and download support.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
  - [Deployment with Docker](#deployment-with-docker)
    - [Building the Docker Image](#building-the-docker-image)
  - [Running the Docker Container](#running-the-docker-container)
- [Usage](#usage)
  - [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Postman Collection](#postman-collection)
- [API Documentation](#api-documentation)
- [Design Decisions](#design-decisions)
- [Contact](#contact)

## Features

- **User Authentication:** Users can sign up and log in to access the application's functionalities.
- **File Upload:** Users can upload files, and each file is associated with the uploader's username and creation date.
- **File Sharing:** Users can share files with other registered users.
- **File Retrieval:** Users can list all their files and those shared with them.
- **File Deletion:** Users can delete files they have uploaded.
- **File Download:** Users can download files.
- **File Renaming:** Users can rename their files.

## Architecture

The system follows a modular architecture using Node.js and Express, with TypeScript for static typing.

### Structure

- **Modules:** Each feature (e.g., Authentication, Attachments, User) is organized as a separate module to improve maintainability and scalability.
- **Routes:** Each module defines its own routes to handle specific API endpoints.
- **Controllers:** Manage incoming requests and delegate the business logic to the appropriate services.
- **Services:** Contain the core business logic and interact with the database through repositories.
- **Repositories:** Handle the data access logic, interacting with the database using TypeORM.

### Diagram of Architecture

![Architecture Diagram](imagen.png)

## Database Schema

The application uses a PostgreSQL database with the following schema:

- **Users Table:**
  - `id` (Primary Key, UUID)
  - `userName` (String, Unique)
  - `email` (String, Unique)
  - `password` (String, Hashed)
  - Timestamps for `createdDate`, `lastModifiedDate`, and soft deletion with `deleteDate`.

- **Attachments Table:**
  - `id` (Primary Key, UUID)
  - `fileName` (String)
  - `fileKey` (String, S3 Object Key)
  - `s3Url` (String, S3 Object URL)
  - `createdBy` (String)
  - Timestamps for `createdDate`, `lastModifiedDate`, and `deleteDate`.
  - Relationship fields for user ownership and shared access.

### Diagram of Database Schema

![Database Schema Diagram](https://easyupload.io/zkr6ai)

## Getting Started

### Prerequisites

- Node.js (version 19.9.0)
- npm (version 6 or higher)
- Docker and Docker Compose (for containerized deployment)
- PostgreSQL database
- AWS Account and S3 bucket configured

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/nachom48/prex-file-sharing.git
    cd prex-file-sharing
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file based on the `.env.example` file provided in the repository, and update it with your environment-specific settings:

    ```plaintext
    NODE_ENV=development
    PORT=3000
    DB_HOST=your_database_host
    DB_PORT=5432
    DB_USERNAME=your_database_username
    DB_PASSWORD=your_database_password
    DB_NAME=your_database_name
    DB_NAME_TEST=your_test_database_name
    JWT_SECRET=your_jwt_secret
    AWS_REGION=your_aws_region
    S3_BUCKET_NAME=your_s3_bucket_name
    ```

### Running the Application

1. Run the database migrations:

    ```bash
    npm run migration:run
    ```

2. Start the application:

    ```bash
    npm start
    ```

## Deployment with Docker

### Building the Docker Image

1. Ensure Docker is installed and running on your machine.
2. Create and configure your `.env` file with the necessary environment variables as mentioned earlier. **Set `DB_HOST=db` instead of `localhost`.**
3. Build the Docker image:

    ```bash
    docker-compose build
    ```

### Running the Docker Container

1. Run the Docker container using Docker Compose:

    ```bash
    docker-compose up
    ```

   This command will start the application and the PostgreSQL database in separate containers. The server will be accessible at [http://localhost:3000](http://localhost:3000).

2. To stop and remove the containers, run:

    ```bash
    docker-compose down
    ```


The server should now be running on `http://localhost:3000`.

## Usage

### API Endpoints

- **Authentication**
  - `POST /api/auth/signup` - Register a new user.
  - `POST /api/auth/signin` - Log in as an existing user.

- **File Management**
  - `POST /api/attachments/upload` - Upload a new file.
  - `GET /api/attachments/list` - List all user files and shared files.
  - `DELETE /api/attachments/deleteFile/:id` - Delete a file.
  - `PUT /api/attachments/:id` - Update a file's name.
  - `POST /api/attachments/share` - Share a file with other users.
  - `GET /api/attachments/download/:id` - Download a file.

## Testing

The tests performed are unit tests and are located in the `__tests__/unit` folder within each module of the project. Below are the unit tests for the `AuthService` and `AttachmentService`.

### Unit Tests for AuthService

- **Sign In Function:**
  - Verifies that a user can successfully log in with valid credentials.
  - Throws an `UnauthorizedException` if the user is not found.
  - Throws an `UnauthorizedException` if the password is incorrect.

- **Sign Up Function:**
  - Verifies that a new user can be created successfully and returns an access token.
  - Throws an error if user creation fails.

### Unit Tests for AttachmentService

- **uploadFile:**
  - Verifies that a file can be uploaded successfully and that the saved file is returned.
  - Throws an `EntityNotFoundException` if the user is not found.

- **deleteFile:**
  - Verifies that a file can be deleted successfully.
  - Throws an `EntityNotFoundException` if the file is not found.
  - Throws an `UnauthorizedException` if the user does not have permission to delete the file.

- **updateFileName:**
  - Verifies that the file name can be updated successfully.
  - Throws an `EntityNotFoundException` if the file is not found.
  - Throws an `UnauthorizedException` if the user does not have permission to update the file.

- **listUserAttachments:**
  - Verifies that a list of user attachments and shared attachments is returned.

- **shareFile:**
  - Verifies that a file can be shared successfully with other users.

- **downloadFile:**
  - Verifies that a file can be downloaded successfully.
  - Throws an `UnauthorizedException` if the user does not have permission to download the file.

### Running Tests

To run the unit tests, use the following command:

```bash
npm test
```


## Postman Collection

A Postman collection is provided in the repository to test all the API endpoints. You can access it by clicking [here](https://tekko6.postman.co/workspace/prex-file-sharing~8c2a840f-42b8-4a5e-b594-75254355a785/collection/21134239-468811e1-0094-4537-95e7-b0bad2e4e1b0/overview?action=share&creator=21134239&active-environment=21134239-134c0313-8d7e-4a2f-9355-dcd90a06a492&action_performed=google_login&workspaceOnboarding=show).

## API Documentation

For a complete reference of all API endpoints, access the Swagger documentation at [http://localhost:3000/api-docs/](http://localhost:3000/api-docs/).

## Design Decisions

- **TypeScript for Static Typing:** Chosen to leverage static typing, which helps catch errors during development and improves code quality.
- **Modular Architecture:** Divided into modules (authentication, attachments) to ensure separation of concerns and enhance maintainability.
- **Routes:** Handle the different API endpoints and delegate request processing to appropriate controllers.
- **Controllers:** Manage the incoming requests and interact with the appropriate services to process the business logic.
- **Services:** Contain the core business logic and handle interactions with the database through repositories.
- **Repositories:** Responsible for data access logic, interacting with the database using TypeORM.
- **Use of AWS S3 for Storage:** AWS S3 is used to store files due to its scalability, durability, and security features.
- **PostgreSQL for Data Persistence:** PostgreSQL was selected for its robust support for relational data and ACID compliance.
- **Docker for Containerization:** Docker and Docker Compose are used to ensure consistency across different environments and facilitate deployment.
- **Use of TypeORM:** TypeORM is employed as the ORM to interact with PostgreSQL, simplifying database operations and migration management.


## Future Enhancements

- **Integration Tests:** Implement integration tests to ensure different parts of the application work together correctly.
- **End-to-End (E2E) Tests:** Develop E2E tests to validate the entire application's functionality from a user's perspective.
- **SonarQube Integration:** Integrate SonarQube for continuous code quality and security checks to maintain high coding standards.


## Contact

For any questions or suggestions, feel free to reach out via [GitHub Issues](https://github.com/nachom48/prex-file-sharing/issues).