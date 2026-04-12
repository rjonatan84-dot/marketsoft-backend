const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SaleDetail = sequelize.define("SaleDetail", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  saleId: { type: DataTypes.INTEGER, allowNull: false },
  productId: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
  price: { type: DataTypes.DECIMAL(10,2), allowNull: false, validate: { min: 0.01 } }
}, { tableName: "sale_details" });

module.exports = SaleDetail;