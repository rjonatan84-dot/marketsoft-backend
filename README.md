
#  MarketSoft – Backend de Supermercado

Backend de un sistema de supermercado desarrollado con **Node.js**, **Express** y **PostgreSQL**, utilizando **Sequelize ORM** y **arquitectura MVC estricta**.  
El proyecto expone una **API REST CRUD funcional** para la gestión de productos, proveedores, usuarios y ventas, documentada con **Swagger**.

***

##  Objetivo del proyecto

Desarrollar el backend completo de un sistema de supermercado que permita:

*   Administrar productos y proveedores
*   Gestionar usuarios del sistema
*   Registrar ventas con múltiples productos
*   Calcular automáticamente el total de cada venta
*   Exponer una API REST lista para ser consumida por un frontend

***

##  Arquitectura

El proyecto está estructurado bajo el patrón **MVC (Model – View – Controller)**:

*   **Model**: Definición de entidades y relaciones con Sequelize
*   **Controller**: Lógica de negocio y operaciones CRUD
*   **Routes**: Definición de endpoints REST
*   **View**: Documentación de la API mediante Swagger

***

## Estructura del proyecto

    marketsoft-backend/
    │
    ├── app.js
    ├── package.json
    ├── .env
    │
    ├── src/
    │   ├── config/
    │   │   ├── database.js
    │   │   └── sync.js
    │   │
    │   ├── models/
    │   │   ├── Provider.model.js
    │   │   ├── Product.model.js
    │   │   ├── User.model.js
    │   │   ├── Sale.model.js
    │   │   ├── SaleDetail.model.js
    │   │   └── index.js
    │   │
    │   ├── controllers/
    │   ├── routes/
    │   ├── middlewares/
    │   └── swagger/
    │       └── swagger.js

***

##  Entidades del sistema

### Productos

*   id
*   name
*   description
*   price (> 0)
*   stock (≥ 0)
*   providerId

### Proveedores

*   id
*   name
*   phone
*   email
*   city

### Usuarios

*   id
*   name
*   email (único)
*   role

###  Ventas

*   id
*   userId
*   date
*   total (calculado automáticamente)

###  DetalleVenta

*   id
*   saleId
*   productId
*   quantity
*   price

***

##  Relaciones

*   Proveedor → Productos (1 a N)
*   Usuario → Ventas (1 a N)
*   Venta → DetalleVenta (1 a N)
*   Producto → DetalleVenta (1 a N)

***

## Endpoints principales (CRUD)

Cada entidad implementa operaciones CRUD completas:

    GET    /api/entity
    GET    /api/entity/:id
    POST   /api/entity
    PUT    /api/entity/:id
    DELETE /api/entity/:id

 Implementado para:

*   Products
*   Providers
*   Users
*   Sales
*   SaleDetails

***

##  Validaciones implementadas

*   Productos:
    *   `price` debe ser mayor a 0
    *   `stock` no puede ser negativo
*   Usuarios:
    *   `email` único
*   Ventas:
    *   `total` calculado automáticamente en backend

***

##  Documentación con Swagger

La API está completamente documentada con **Swagger (OpenAPI 3.0)**.

 Acceso:

    http://localhost:3000/api-docs

Desde Swagger se pueden:

*   Visualizar todos los endpoints
*   Ver schemas de cada entidad
*   Probar operaciones CRUD con **Try it out**

***

##  Base de datos

*   **Gestor**: PostgreSQL
*   **ORM**: Sequelize
*   Sincronización automática de modelos al iniciar el servidor

***

##  Configuración y ejecución

###  Requisitos

*   Node.js
*   PostgreSQL
*   npm

###  Instalar dependencias

```bash
npm install
```

###  Configurar variables de entorno (`.env`)

```env
PORT=3000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=*****
DB_NAME=marketsoft
DB_DIALECT=postgres
```

###  Ejecutar el proyecto

```bash
npm start
# o en desarrollo
npm run dev
```

***

## Pruebas de funcionamiento

*   Insertar registros mediante **POST** desde Swagger
*   Consultar con **GET**
*   Actualizar con **PUT**
*   Eliminar con **DELETE**

 Los cambios se reflejan directamente en la base de datos.

***

##  Integrantes del equipo

*   **Jonatan Eduar Riascos López** – Backend / API REST / Base de datos



***

## ✅ Estado del proyecto

*   ✔ API REST funcional
*   ✔ CRUD completo
*   ✔ Validaciones mínimas implementadas
*   ✔ Sequelize ORM
*   ✔ Arquitectura MVC
*   ✔ Swagger documentado
*   ✔ Listo para consumo por frontend


