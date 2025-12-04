document.addEventListener("DOMContentLoaded", function () {
  // Carregar dados do usuário
  fetch("/api/usuario")
    .then((response) => response.json())
    .then((data) => {
      // Verificar se o usuário é bolsista e mostrar o link de Matérias
      if (data.tipo === "BOLSISTA") {
        const linkMaterias = document.getElementById("link-materias");
        if (linkMaterias) linkMaterias.style.display = "block";
      }
    })
    .catch((error) => {
      console.error("Erro ao carregar dados do usuário:", error);
    });
});
