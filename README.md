Prex - File Sharing System
📖 Description

Prex is a file-sharing system developed as part of a technical assessment. It allows users to sign up, log in, upload files, share them with other users, and perform various file management operations. The application is built using TypeScript, Express.js, TypeORM, PostgreSQL, and AWS S3 for file storage.
📝 Implementation Decisions

    Authentication and Authorization:
        JWT (JSON Web Tokens) is used for user authentication and authorization. Tokens are generated upon login and used to authorize subsequent requests.
        bcrypt is used for password hashing, ensuring that user passwords are secure and not stored in plain text.

    File Management:
        Files uploaded by users are stored in AWS S3 using the AWS SDK for Node.js.
        Each uploaded file generates a unique key in S3 to avoid collisions and allows easy access to the file via a URL.

    Project Architecture:
        A modular approach is followed to separate the application's responsibilities. For example, the auth module handles authentication and authorization, while the attachment module manages all file-related operations.
        A pattern of services and controllers is implemented, where services handle business logic and controllers handle HTTP requests.

    Testing:
        Unit tests, integration tests, and end-to-end (e2e) tests are configured using Jest and Supertest to ensure code quality and system functionality.
        Unit tests verify the functionality of individual components such as services and controllers in isolation.
        Integration tests ensure that multiple system components work correctly when combined, such as interactions between the API and the database.
        End-to-end (e2e) tests validate the entire application flow, from client requests to server responses, ensuring that the entire system works as expected.

    API Documentation:
        Swagger is used to document the API, making it easier for other developers to understand and use the available endpoints.

📊 Database Diagram

Database Diagram

The system uses PostgreSQL as the primary database, with the following main entities:

    User: Stores information about users, including authentication credentials.
    Attachment: Stores information about files uploaded by users and their storage details in S3.
    Shared Attachments: An intermediate table that manages the relationships of files shared between users.

🏗️ Architecture Diagram

Architecture Diagram

The application follows a modular architecture where each module (auth, attachment, user) has its own controllers, services, entities, and DTOs.
🚀 Steps to Run the Project
🛠️ Requirements

    Docker and Docker Compose installed on your machine.
    Access to AWS with configured credentials to upload files to S3.
    Node.js (version 19 or higher) installed if running without Docker.

🔧 Instructions

    Clone the Repository:

    bash

git clone https://github.com/your-username/prex.git
cd prex

Set Up Environment Variables:

Create a .env file in the project's root directory with the following environment variables:

env

DB_HOST=db
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=[YOUR_DB_PASSWORD]
DB_NAME=prex
PORT=3000
JWT_SECRET=[YOUR_JWT_SECRET]
AWS_ACCESS_KEY_ID=[YOUR_AWS_ACCESS_KEY_ID]
AWS_SECRET_ACCESS_KEY=[YOUR_AWS_SECRET_ACCESS_KEY]
AWS_REGION=[YOUR_AWS_REGION]
S3_BUCKET_NAME=[YOUR_S3_BUCKET_NAME]

    Make sure to replace the values in square brackets ([]) with your actual credentials and configurations.

Build and Run the Project with Docker:

Run the following command to build and start the Docker containers for the application and the database:

bash

docker-compose up --build

This will download the necessary images, install dependencies, build the project, and start the services.

Access the API Documentation:

Once the containers are running, you can access the Swagger API documentation by navigating to:

bash

http://localhost:3000/api-docs

From this interface, you can test the API endpoints directly in your browser.

Import the Postman Collection:

Import the Postman collection (Prex.postman_collection.json) from the project's root directory into your Postman client. This collection includes examples of all the requests needed to interact with the system, such as:

    Register a new user: Test the /api/auth/signup endpoint.
    User login: Test the /api/auth/signin endpoint.
    Upload a file: Test the /api/attachments/upload endpoint.
    List user files: Test the /api/attachments/list endpoint.
    Share a file: Test the /api/attachments/share endpoint.
    Delete a file: Test the /api/attachments/deleteFile/{id} endpoint.

Run Tests:

To run the configured unit, integration, and e2e tests, use the following command:

bash

npm run test

This will execute all tests and provide feedback on the quality and functionality of the system.