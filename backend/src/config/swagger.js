const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CarConnect API',
      version: '1.0.0',
      description: 'A workplace carpooling platform API',
      contact: {
        name: 'Neha',
        email: 'neha@carconnect.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
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
    },
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'], // Path to API docs
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
