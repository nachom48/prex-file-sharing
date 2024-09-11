import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Prex API Documentation',
      version: '1.0.0',
      description: 'File Sharing System With NodeJs',
    },
    contact: {
      name: "Ignacio Muñoz",
      url: "https://github.com/nachom48",
      email: "nachom48@gmail.com",
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Attachment: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'ID of the attachment' },
            fileName: { type: 'string', description: 'Name of the file' },
            fileKey: { type: 'string', description: 'S3 key of the file' },
            s3Url: { type: 'string', description: 'URL of the file in S3' },
            createdBy: { type: 'string', description: 'User who created the file' },
            createdDate: { type: 'string', format: 'date-time', description: 'Date when the file was created' },
            lastModifiedDate: { type: 'string', format: 'date-time', description: 'Date when the file was last modified' },
          },
        },
      },
    },
  },
  apis: ['./src/modules/**/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
