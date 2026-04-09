import swaggerJsdoc from "swagger-jsdoc"
import { OpenAPIV3 } from "openapi-types"

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Alfatihah API",
            version: "1.0.0",
            description: "API documentation for Alfatihah",
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT}`,
            },
        ],
        paths: {},
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    } as OpenAPIV3.Document,
    apis: ["./src/features/**/docs/*.swagger.ts"]
}

export const swaggerSpec = swaggerJsdoc(options)