const { Provider, Product } = require("../models");

exports.getAll = async (req, res, next) => {
  try { res.json(await Provider.findAll({ include: Product })); }
  catch (e) { next(e); }
};

exports.getById = async (req, res, next) => {
  try {
    const item = await Provider.findByPk(req.params.id, { include: Product });
    if (!item) return res.status(404).json({ message: "Provider not found" });
    res.json(item);
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try { res.status(201).json(await Provider.create(req.body)); }
  catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const item = await Provider.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Provider not found" });
    await item.update(req.body);
    res.json(item);
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const item = await Provider.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Provider not found" });
    await item.destroy();
    res.json({ message: "Deleted" });
  } catch (e) { next(e); }
};