const dotenv = require("dotenv");
const app = require("./app");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

require("dotenv").config({ path: `.env` });
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` }); 

const PORT = process.env.PORT;

console.log("PORT:", process.env.PORT);

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Black puppy API Documentation",
      version: "1.0.0",
      description: "Black puppy API documentation",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// ใช้งาน Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
