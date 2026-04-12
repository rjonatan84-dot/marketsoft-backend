module.exports = (err, req, res, next) => {
  // Unique constraint email, validation, etc.
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({ message: err.errors?.[0]?.message || "Unique constraint error" });
  }
  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({ message: err.errors.map(e => e.message) });
  }
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
};
