const { sequelize, Sale, SaleDetail, Product, User } = require("../models");

exports.getAll = async (req, res, next) => {
  try {
    const data = await Sale.findAll({
      include: [
        { model: User },
        { model: SaleDetail, include: [Product] }
      ]
    });
    res.json(data);
  } catch (e) { next(e); }
};

exports.getById = async (req, res, next) => {
  try {
    const item = await Sale.findByPk(req.params.id, {
      include: [
        { model: User },
        { model: SaleDetail, include: [Product] }
      ]
    });
    if (!item) return res.status(404).json({ message: "Sale not found" });
    res.json(item);
  } catch (e) { next(e); }
};

/**
 * POST /api/sales
 * body ejemplo:
 * {
 *   "userId": 1,
 *   "date": "2026-04-11T10:00:00Z",
 *   "items": [{ "productId": 2, "quantity": 3 }, { "productId": 1, "quantity": 1 }]
 * }
 */
exports.create = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { userId, date, items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "items is required and must be non-empty array" });
    }

    // 1) crear venta con total 0
    const sale = await Sale.create({ userId, date, total: 0 }, { transaction: t });

    // 2) crear detalles con precio del producto
    let total = 0;

    for (const it of items) {
      const product = await Product.findByPk(it.productId, { transaction: t });
      if (!product) {
        await t.rollback();
        return res.status(400).json({ message: `Product ${it.productId} not found` });
      }
      if (product.stock < it.quantity) {
        await t.rollback();
        return res.status(400).json({ message: `Insufficient stock for product ${product.id}` });
      }

      const price = Number(product.price);
      const quantity = Number(it.quantity);
      total += price * quantity;

      await SaleDetail.create({
        saleId: sale.id,
        productId: product.id,
        quantity,
        price
      }, { transaction: t });

      // opcional: descontar stock
      await product.update({ stock: product.stock - quantity }, { transaction: t });
    }

    // 3) actualizar total
    await sale.update({ total: Number(total.toFixed(2)) }, { transaction: t });

    await t.commit();

    const created = await Sale.findByPk(sale.id, {
      include: [{ model: SaleDetail, include: [Product] }]
    });

    res.status(201).json(created);
  } catch (e) {
    await t.rollback();
    next(e);
  }
};

exports.update = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const sale = await Sale.findByPk(req.params.id, { transaction: t });
    if (!sale) return res.status(404).json({ message: "Sale not found" });

    const { userId, date, items } = req.body;

    // actualizar cabecera
    await sale.update({ userId: userId ?? sale.userId, date: date ?? sale.date }, { transaction: t });

    // si vienen items, recalcular
    if (Array.isArray(items)) {
      // devolver stock de detalles anteriores (opcional)
      const prevDetails = await SaleDetail.findAll({ where: { saleId: sale.id }, transaction: t, include: [Product] });
      for (const d of prevDetails) {
        const p = await Product.findByPk(d.productId, { transaction: t });
        if (p) await p.update({ stock: p.stock + d.quantity }, { transaction: t });
      }

      await SaleDetail.destroy({ where: { saleId: sale.id }, transaction: t });

      let total = 0;
      for (const it of items) {
        const product = await Product.findByPk(it.productId, { transaction: t });
        if (!product) {
          await t.rollback();
          return res.status(400).json({ message: `Product ${it.productId} not found` });
        }
        if (product.stock < it.quantity) {
          await t.rollback();
          return res.status(400).json({ message: `Insufficient stock for product ${product.id}` });
        }
        const price = Number(product.price);
        const quantity = Number(it.quantity);
        total += price * quantity;

        await SaleDetail.create({
          saleId: sale.id,
          productId: product.id,
          quantity,
          price
        }, { transaction: t });

        await product.update({ stock: product.stock - quantity }, { transaction: t });
      }

      await sale.update({ total: total.toFixed(2) }, { transaction: t });
    }

    await t.commit();

    const updated = await Sale.findByPk(sale.id, { include: [{ model: SaleDetail, include: [Product] }] });
    res.json(updated);
  } catch (e) {
    await t.rollback();
    next(e);
  }
};

exports.remove = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const sale = await Sale.findByPk(req.params.id, { transaction: t });
    if (!sale) return res.status(404).json({ message: "Sale not found" });

    // devolver stock (opcional pero recomendable)
    const details = await SaleDetail.findAll({ where: { saleId: sale.id }, transaction: t });
    for (const d of details) {
      const p = await Product.findByPk(d.productId, { transaction: t });
      if (p) await p.update({ stock: p.stock + d.quantity }, { transaction: t });
    }

    await sale.destroy({ transaction: t });
    await t.commit();
    res.json({ message: "Deleted" });
  } catch (e) {
    await t.rollback();
    next(e);
  }
};