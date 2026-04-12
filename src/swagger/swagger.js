const swaggerJSDoc = require("swagger-jsdoc");

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MarketSoft Supermercado API",
      version: "1.0.0",
      description:
        "API REST para gestión de supermercado (Productos, Proveedores, Usuarios, Ventas y DetalleVenta)",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    paths: {
      "/api/products": {
        get: { summary: "Obtener todos los productos" },
        post: { summary: "Crear un producto" },
      },
      "/api/products/{id}": {
        get: { summary: "Obtener producto por ID" },
        put: { summary: "Actualizar producto" },
        delete: { summary: "Eliminar producto" },
      },

      "/api/providers": {
        get: { summary: "Obtener proveedores" },
        post: { summary: "Crear proveedor" },
      },

      "/api/users": {
        get: { summary: "Obtener usuarios" },
        post: { summary: "Crear usuario" },
      },

      "/api/sales": {
        get: { summary: "Obtener ventas" },
        post: { summary: "Crear venta" },
      },
    },
  },
  apis: [],
});

module.exports = swaggerSpec;