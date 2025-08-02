const express = require("express");
const app = express();
const routes = require("./routes");
const path = require("path");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public")); // Isso faz com que /css/cadastro.css aponte para public/css/cadastro.css
app.use(routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
