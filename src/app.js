const express = require("express");
const session = require("express-session");
const app = express();
const path = require("path");

// Configuração do express-session
app.use(
  session({
    secret: "sua-chave-secreta-aqui",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 3600000,
    },
  })
);

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir arquivos estáticos (public está na raiz do projeto)
app.use(express.static(path.join(__dirname, "..", "public")));

// Rotas
const routes = require("./routes");
app.use(routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
