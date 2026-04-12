const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Provider = sequelize.define("Provider", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, validate: { isEmail: true } },
  city: { type: DataTypes.STRING, allowNull: false }
}, { tableName: "providers" });

module.exports = Provider;