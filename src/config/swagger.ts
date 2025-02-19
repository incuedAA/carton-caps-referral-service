import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Carton Caps Referral API",
      version: "1.0.0",
      description: "API documentation for Carton Caps referral service",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          description: "Client authentication",
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        serverAuth: {
          description: "Server-to-Server authentication",
          type: "apiKey",
          in: "header",
          name: "x-signature",
        },
      },
    },
  },
  apis: ["./src/api/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
