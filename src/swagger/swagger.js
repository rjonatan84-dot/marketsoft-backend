// src/swagger/swagger.js
const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "MarketSoft Supermercado API",
    version: "1.0.0",
    description:
      "API REST para gestión de supermercado (Productos, Proveedores, Usuarios, Ventas y DetalleVenta)."
  },
  servers: [{ url: "http://localhost:3000" }],
  tags: [
    { name: "Products", description: "Gestión de productos" },
    { name: "Providers", description: "Gestión de proveedores" },
    { name: "Users", description: "Gestión de usuarios" },
    { name: "Sales", description: "Gestión de ventas" },
    { name: "SaleDetails", description: "Gestión de detalle de venta" }
  ],

  components: {
    schemas: {
      Error: {
        type: "object",
        properties: { message: { type: "string", example: "Error message" } }
      },

      Provider: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Proveedor S.A.S" },
          phone: { type: "string", example: "3001234567" },
          email: { type: "string", format: "email", example: "proveedor@correo.com" },
          city: { type: "string", example: "Popayán" }
        },
        required: ["name", "phone", "email", "city"]
      },

      Product: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Arroz 1kg" },
          description: { type: "string", example: "Arroz blanco premium" },
          price: { type: "number", format: "float", example: 5500 },
          stock: { type: "integer", example: 20 },
          providerId: { type: "integer", example: 2 }
        },
        required: ["name", "price", "stock", "providerId"],
        description: "price > 0 y stock >= 0 (validaciones mínimas del taller)."
      },

      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Juan Pérez" },
          email: { type: "string", format: "email", example: "juan@correo.com" },
          role: { type: "string", example: "admin" }
        },
        required: ["name", "email", "role"],
        description: "email debe ser único (validación mínima del taller)."
      },

      SaleDetail: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          saleId: { type: "integer", example: 10 },
          productId: { type: "integer", example: 3 },
          quantity: { type: "integer", example: 2 },
          price: { type: "number", format: "float", example: 5500 }
        },
        required: ["saleId", "productId", "quantity", "price"]
      },

      Sale: {
        type: "object",
        properties: {
          id: { type: "integer", example: 10 },
          userId: { type: "integer", example: 1 },
          date: { type: "string", format: "date-time", example: "2026-04-11T15:00:00Z" },
          total: { type: "number", format: "float", example: 16500 }
        },
        required: ["userId"],
        description:
          "El total se calcula automáticamente (requisito del taller)."
      },

      // Para crear/actualizar ventas con items (recomendado)
      SaleItemInput: {
        type: "object",
        properties: {
          productId: { type: "integer", example: 3 },
          quantity: { type: "integer", example: 2 }
        },
        required: ["productId", "quantity"]
      },

      SaleCreateRequest: {
        type: "object",
        properties: {
          userId: { type: "integer", example: 1 },
          date: { type: "string", format: "date-time", example: "2026-04-11T15:00:00Z" },
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/SaleItemInput" }
          }
        },
        required: ["userId", "items"],
        description:
          "Al crear una venta, el total debe calcularse automáticamente."
      },

      SaleUpdateRequest: {
        type: "object",
        properties: {
          userId: { type: "integer", example: 1 },
          date: { type: "string", format: "date-time", example: "2026-04-11T18:00:00Z" },
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/SaleItemInput" }
          }
        },
        description:
          "Si envías items en PUT, se recalcula el total automáticamente."
      }
    },

    parameters: {
      IdParam: {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "integer" }
      }
    }
  },

  paths: {
    // ---------------- PRODUCTS ----------------
    "/api/products": {
      get: {
        tags: ["Products"],
        summary: "Listar productos",
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Product" } }
              }
            }
          }
        }
      },
      post: {
        tags: ["Products"],
        summary: "Crear producto",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Product" } } }
        },
        responses: {
          201: {
            description: "Creado",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Product" } } }
          },
          400: { description: "Validación", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
        }
      }
    },
    "/api/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Obtener producto por id",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          200: { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/Product" } } } },
          404: { description: "No encontrado", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
        }
      },
      put: {
        tags: ["Products"],
        summary: "Actualizar producto",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Product" } } } },
        responses: {
          200: { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/Product" } } } },
          400: { description: "Validación", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          404: { description: "No encontrado", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
        }
      },
      delete: {
        tags: ["Products"],
        summary: "Eliminar producto",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          200: { description: "Eliminado", content: { "application/json": { schema: { type: "object", properties: { message: { type: "string", example: "Deleted" } } } } } },
          404: { description: "No encontrado", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
        }
      }
    },

    // ---------------- PROVIDERS ----------------
    "/api/providers": {
      get: {
        tags: ["Providers"],
        summary: "Listar proveedores",
        responses: {
          200: {
            description: "OK",
            content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Provider" } } } }
          }
        }
      },
      post: {
        tags: ["Providers"],
        summary: "Crear proveedor",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Provider" } } } },
        responses: {
          201: { description: "Creado", content: { "application/json": { schema: { $ref: "#/components/schemas/Provider" } } } },
          400: { description: "Validación", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
        }
      }
    },
    "/api/providers/{id}": {
      get: {
        tags: ["Providers"],
        summary: "Obtener proveedor por id",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          200: { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/Provider" } } } },
          404: { description: "No encontrado", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
        }
      },
      put: {
        tags: ["Providers"],
        summary: "Actualizar proveedor",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Provider" } } } },
        responses: {
          200: { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/Provider" } } } },
          404: { description: "No encontrado", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
        }
      },
      delete: {
        tags: ["Providers"],
        summary: "Eliminar proveedor",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          200: { description: "Eliminado", content: { "application/json": { schema: { type: "object", properties: { message: { type: "string", example: "Deleted" } } } } } },
          404: { description: "No encontrado", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
        }
      }
    },

    // ---------------- USERS ----------------
    "/api/users": {
      get: {
        tags: ["Users"],
        summary: "Listar usuarios",
        responses: {
          200: { description: "OK", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/User" } } } } }
        }
      },
      post: {
        tags: ["Users"],
        summary: "Crear usuario",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
        responses: {
          201: { description: "Creado", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
          400: { description: "Validación/email único", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
        }
      }
    },
    "/api/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Obtener usuario por id",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          200: { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
          404: { description: "No encontrado", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
        }
      },
      put: {
        tags: ["Users"],
        summary: "Actualizar usuario",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
        responses: {
          200: { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
          400: { description: "Validación/email único", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          404: { description: "No encontrado", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
        }
      },
      delete: {
        tags: ["Users"],
        summary: "Eliminar usuario",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          200: { description: "Eliminado", content: { "application/json": { schema: { type: "object", properties: { message: { type: "string", example: "Deleted" } } } } } },
          404: { description: "No encontrado", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
        }
      }
    },

    // ---------------- SALES ----------------
    "/api/sales": {
      get: {
        tags: ["Sales"],
        summary: "Listar ventas",
        responses: {
          200: { description: "OK", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Sale" } } } } }
        }
      },
      post: {
        tags: ["Sales"],
        summary: "Crear venta (total automático)",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/SaleCreateRequest" } } }
        },
        responses: {
          201: { description: "Creado", content: { "application/json": { schema: { $ref: "#/components/schemas/Sale" } } } },
          400: { description: "Validación", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
        }
      }
    },
    "/api/sales/{id}": {
      get: {
        tags: ["Sales"],
        summary: "Obtener venta por id",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          200: { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/Sale" } } } },
          404: { description: "No encontrado", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
        }
      },
      put: {
        tags: ["Sales"],
        summary: "Actualizar venta (recalcula total si envías items)",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/SaleUpdateRequest" } } } },
        responses: {
          200: { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/Sale" } } } },
          400: { description: "Validación", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          404: { description: "No encontrado", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
        }
      },
      delete: {
        tags: ["Sales"],
        summary: "Eliminar venta",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          200: { description: "Eliminado", content: { "application/json": { schema: { type: "object", properties: { message: { type: "string", example: "Deleted" } } } } } },
          404: { description: "No encontrado", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
        }
      }
    },

    // ---------------- SALE DETAILS ----------------
    "/api/sale-details": {
      get: {
        tags: ["SaleDetails"],
        summary: "Listar detalles de venta",
        responses: {
          200: { description: "OK", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/SaleDetail" } } } } }
        }
      },
      post: {
        tags: ["SaleDetails"],
        summary: "Crear detalle de venta",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/SaleDetail" } } } },
        responses: {
          201: { description: "Creado", content: { "application/json": { schema: { $ref: "#/components/schemas/SaleDetail" } } } },
          400: { description: "Validación", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
        }
      }
    },
    "/api/sale-details/{id}": {
      get: {
        tags: ["SaleDetails"],
        summary: "Obtener detalle por id",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          200: { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/SaleDetail" } } } },
          404: { description: "No encontrado", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
        }
      },
      put: {
        tags: ["SaleDetails"],
        summary: "Actualizar detalle de venta",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/SaleDetail" } } } },
        responses: {
          200: { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/SaleDetail" } } } },
          404: { description: "No encontrado", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
        }
      },
      delete: {
        tags: ["SaleDetails"],
        summary: "Eliminar detalle de venta",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          200: { description: "Eliminado", content: { "application/json": { schema: { type: "object", properties: { message: { type: "string", example: "Deleted" } } } } } },
          404: { description: "No encontrado", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
        }
      }
    }
  }
};

module.exports = swaggerSpec;