document.querySelector("form").addEventListener("submit", function (e) {
  const senha = document.getElementById("senha").value;
  const confirmeSenha = document.getElementById("confirmesenha").value;
  const tipo = document.getElementById("tipo").value;

  if (senha !== confirmeSenha) {
    e.preventDefault();
    alert("As senhas não coincidem!");
    return false;
  }

  if (!tipo) {
    e.preventDefault();
    alert("Por favor, selecione um tipo de usuário!");
    return false;
  }
  return true;
});
