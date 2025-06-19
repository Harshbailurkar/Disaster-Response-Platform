module.exports = function (req, res, next) {
  const token = req.headers["authorization"];
  if (token !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ error: "Unauthorized" });
  }
  next();
};
