import swaggerAutogen from "swagger-autogen";

const outputFile = "./swagger-output.json";
const endpointsFile = ["../routes/api.ts"];
const doc = {
    info: {
        version: "v0.0.1",
        title: "Dokumentasi API Acara",
        description: "Implementasi Swagger di API Acara"
    },
 
    servers: [
        {
            url: "http://localhost:3000/api",
            description: "Local Development"
        },
        {
            url: "https://be-course-orpin.vercel.app/api",
            description: "Deploy server"
        },
    ],

    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
            }
        },

        schemas: {
            LoginRequest: {
                identifier: "yelena123",
                password: "redguardian"
            }
        }
    }
}
swaggerAutogen({ openapi: "3.0.0"})(outputFile, endpointsFile, doc)