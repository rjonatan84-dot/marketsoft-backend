const express = require("express");
const DatabaseSync = require("./src/config/sync");


const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/swagger/swagger");

// Rutas
const productRoutes = require("./src/routes/product.routes");
const providerRoutes = require("./src/routes/provider.routes");
const userRoutes = require("./src/routes/user.routes");
const saleRoutes = require("./src/routes/sale.routes");
const saleDetailRoutes = require("./src/routes/saleDetail.routes");

// (Opcional pero recomendado)
const errorHandler = require("./src/middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

/** ✅ Ruta base */
app.get("/", (req, res) => {
  res.json({ message: "Server is running successfully" });
});

/** ✅ Swagger (View / documentación) */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/** ✅ Montaje de endpoints REST por entidad */
app.use("/api/products", productRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/sale-details", saleDetailRoutes);

/** ✅ Middleware de errores (al final) */
app.use(errorHandler);

/** ✅ Arranque controlado: primero DB, luego listen */
async function startServer() {
  try {
    await DatabaseSync.sync(); // <- aquí conectas/sincronizas BD
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(`Swagger at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
}

startServer();