function checkAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
}

function checkBolsista(req, res, next) {
  if (req.session.user && req.session.user.tipo === "BOLSISTA") {
    next();
  } else {
    res
      .status(403)
      .send("Acesso negado. Apenas bolsistas podem acessar esta página.");
  }
}

module.exports = { checkAuth, checkBolsista };
