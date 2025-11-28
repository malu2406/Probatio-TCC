document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector('form[action="/login"]');

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      const email = document.getElementById("email").value;
      const senha = document.getElementById("senha").value;

      if (!email || !senha) {
        e.preventDefault();
        alert("Por favor, preencha todos os campos!");
        return false;
      }

      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("error")) {
        alert("Email ou senha incorretos!");
      }

      return true;
    });
  }
});
