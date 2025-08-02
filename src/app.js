const express = require("express");
const session = require("express-session");
const app = express();
const routes = require("./routes");
const path = require("path");

// Configuração do express-session
app.use(
  session({
    secret: "sua-chave-secreta-aqui", // Troque por uma string complexa
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Defina como true em produção com HTTPS
      maxAge: 3600000, // 1 hora
    },
  })
);

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public")); // Isso faz com que /css/cadastro.css aponte para public/css/cadastro.css

// Rotas
app.use(routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
