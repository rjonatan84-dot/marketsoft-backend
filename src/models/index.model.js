const sequelize = require("../config/database");

const Provider = require('./Provider.model');
const Product = require('./Product.model');
const User = require("./user.model");
const Sale = require("./Sale.model");
const SaleDetail = require("./SaleDetail.model");


Provider.hasMany(Product, { foreignKey: "providerId", onDelete: "RESTRICT" });
Product.belongsTo(Provider, { foreignKey: "providerId" });


User.hasMany(Sale, { foreignKey: "userId", onDelete: "RESTRICT" });
Sale.belongsTo(User, { foreignKey: "userId" });


Sale.hasMany(SaleDetail, { foreignKey: "saleId", onDelete: "CASCADE" });
SaleDetail.belongsTo(Sale, { foreignKey: "saleId" });


Product.hasMany(SaleDetail, { foreignKey: "productId", onDelete: "RESTRICT" });
SaleDetail.belongsTo(Product, { foreignKey: "productId" });

module.exports = {
  sequelize,
  Provider,
  Product,
  User,
  Sale,
  SaleDetail
};