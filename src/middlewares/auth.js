function checkAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
}

function checkADMIN(req, res, next) {
  if (req.session.user && req.session.user.tipo === "ADMIN") {
    next();
  } else {
    res
      .status(403)
      .send("Acesso negado. Apenas ADMINs podem acessar esta página.");
  }
}

module.exports = { checkAuth, checkADMIN };
