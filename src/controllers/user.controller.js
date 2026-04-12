const { User } = require("../models");

exports.getAll = async (req, res, next) => {
  try { res.json(await User.findAll()); }
  catch (e) { next(e); }
};

exports.getById = async (req, res, next) => {
  try {
    const item = await User.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "User not found" });
    res.json(item);
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try { res.status(201).json(await User.create(req.body)); }
  catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const item = await User.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "User not found" });
    await item.update(req.body);
    res.json(item);
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const item = await User.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "User not found" });
    await item.destroy();
    res.json({ message: "Deleted" });
  } catch (e) { next(e); }
};