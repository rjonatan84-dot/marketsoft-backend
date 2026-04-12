const { SaleDetail, Product, Sale } = require("../models");

exports.getAll = async (req, res, next) => {
  try {
    res.json(await SaleDetail.findAll({ include: [Product, Sale] }));
  } catch (e) { next(e); }
};

exports.getById = async (req, res, next) => {
  try {
    const item = await SaleDetail.findByPk(req.params.id, { include: [Product, Sale] });
    if (!item) return res.status(404).json({ message: "SaleDetail not found" });
    res.json(item);
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    res.status(201).json(await SaleDetail.create(req.body));
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const item = await SaleDetail.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "SaleDetail not found" });
    await item.update(req.body);
    res.json(item);
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const item = await SaleDetail.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "SaleDetail not found" });
    await item.destroy();
    res.json({ message: "Deleted" });
  } catch (e) { next(e); }
};