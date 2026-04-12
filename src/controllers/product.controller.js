const { Product, Provider } = require("../models");

exports.getAll = async (req, res, next) => {
  try {
    const data = await Product.findAll({ include: Provider });
    res.json(data);
  } catch (e) { next(e); }
};

exports.getById = async (req, res, next) => {
  try {
    const item = await Product.findByPk(req.params.id, { include: Provider });
    if (!item) return res.status(404).json({ message: "Product not found" });
    res.json(item);
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const created = await Product.create(req.body);
    res.status(201).json(created);
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const item = await Product.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Product not found" });
    await item.update(req.body);
    res.json(item);
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const item = await Product.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Product not found" });
    await item.destroy();
    res.json({ message: "Deleted" });
  } catch (e) { next(e); }
};