// /javascript/cadastro.js
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector('form[action="/cadastro"]');
  const senhaInput = document.getElementById("senha");
  const confirmeSenhaInput = document.getElementById("confirmesenha");
  const tipoInput = document.getElementById("tipo");

  if (form && senhaInput) {
    // Função para adicionar mensagem de erro
    function addPasswordValidationMessage() {
      if (senhaInput && !document.getElementById("password-error")) {
        const errorSpan = document.createElement("span");
        errorSpan.id = "password-error";
        errorSpan.style.cssText = `
          color: red;
          font-size: 12px;
          margin-top: 5px;
          display: block;
          margin-left: 20px;
          font-family: 'texto', sans-serif;
        `;
        errorSpan.textContent = "A senha deve ter pelo menos 7 caracteres";
        errorSpan.style.display = "none";

        senhaInput.parentNode.appendChild(errorSpan);
      }
    }

    // Função para validar senha
    function validatePassword(showMessage = true) {
      const senha = senhaInput.value;
      const errorSpan = document.getElementById("password-error");

      if (senha.length > 0 && senha.length < 7) {
        senhaInput.style.borderColor = "red";
        senhaInput.style.boxShadow = "0 0 0 3px rgba(255, 0, 0, 0.2)";
        if (errorSpan && showMessage) {
          errorSpan.style.display = "block";
        }
        return false;
      } else {
        senhaInput.style.borderColor = "";
        senhaInput.style.boxShadow = "";
        if (errorSpan) {
          errorSpan.style.display = "none";
        }
        return true;
      }
    }

    // Função para validar confirmação de senha
    function validatePasswordConfirmation() {
      const senha = senhaInput.value;
      const confirmeSenha = confirmeSenhaInput.value;

      if (confirmeSenha.length > 0 && senha !== confirmeSenha) {
        confirmeSenhaInput.style.borderColor = "red";
        confirmeSenhaInput.style.boxShadow = "0 0 0 3px rgba(255, 0, 0, 0.2)";
        return false;
      } else {
        confirmeSenhaInput.style.borderColor = "";
        confirmeSenhaInput.style.boxShadow = "";
        return true;
      }
    }

    // Função para validar tipo de usuário
    function validateUserType() {
      if (!tipoInput.value) {
        tipoInput.style.borderColor = "red";
        tipoInput.style.boxShadow = "0 0 0 3px rgba(255, 0, 0, 0.2)";
        return false;
      } else {
        tipoInput.style.borderColor = "";
        tipoInput.style.boxShadow = "";
        return true;
      }
    }

    // Inicializar validação
    addPasswordValidationMessage();

    // Validar em tempo real enquanto digita
    senhaInput.addEventListener("input", function () {
      validatePassword(true);

      // Também validar confirmação de senha quando a senha muda
      if (confirmeSenhaInput.value.length > 0) {
        validatePasswordConfirmation();
      }
    });

    // Validar ao sair do campo (blur)
    senhaInput.addEventListener("blur", function () {
      validatePassword(true);
    });

    // Validar ao focar no campo
    senhaInput.addEventListener("focus", function () {
      if (senhaInput.value.length > 0 && senhaInput.value.length < 7) {
        senhaInput.style.borderColor = "red";
        senhaInput.style.boxShadow = "0 0 0 3px rgba(255, 0, 0, 0.2)";
        const errorSpan = document.getElementById("password-error");
        if (errorSpan) {
          errorSpan.style.display = "block";
        }
      }
    });

    // Validar confirmação de senha em tempo real
    if (confirmeSenhaInput) {
      confirmeSenhaInput.addEventListener(
        "input",
        validatePasswordConfirmation
      );
      confirmeSenhaInput.addEventListener("blur", validatePasswordConfirmation);
      confirmeSenhaInput.addEventListener("focus", function () {
        if (
          confirmeSenhaInput.value.length > 0 &&
          senhaInput.value !== confirmeSenhaInput.value
        ) {
          confirmeSenhaInput.style.borderColor = "red";
          confirmeSenhaInput.style.boxShadow = "0 0 0 3px rgba(255, 0, 0, 0.2)";
        }
      });
    }

    // Validar tipo de usuário em tempo real
    if (tipoInput) {
      tipoInput.addEventListener("change", validateUserType);
      tipoInput.addEventListener("blur", validateUserType);
    }

    // Validar no envio do formulário
    form.addEventListener("submit", function (e) {
      const senha = senhaInput.value;
      const confirmeSenha = confirmeSenhaInput ? confirmeSenhaInput.value : "";
      const tipo = tipoInput ? tipoInput.value : "";

      let isValid = true;
      let firstErrorField = null;

      // Validar tamanho da senha
      if (senha.length < 7) {
        e.preventDefault();
        senhaInput.style.borderColor = "red";
        senhaInput.style.boxShadow = "0 0 0 3px rgba(255, 0, 0, 0.2)";
        const errorSpan = document.getElementById("password-error");
        if (errorSpan) {
          errorSpan.style.display = "block";
        }
        if (!firstErrorField) firstErrorField = senhaInput;
        isValid = false;
      } else {
        validatePassword(false);
      }

      // Validar se senhas coincidem
      if (confirmeSenhaInput && senha !== confirmeSenha) {
        e.preventDefault();
        confirmeSenhaInput.style.borderColor = "red";
        confirmeSenhaInput.style.boxShadow = "0 0 0 3px rgba(255, 0, 0, 0.2)";
        if (!firstErrorField) firstErrorField = confirmeSenhaInput;
        isValid = false;
      } else if (confirmeSenhaInput) {
        validatePasswordConfirmation();
      }

      // Validar tipo de usuário
      if (tipoInput && !tipo) {
        e.preventDefault();
        tipoInput.style.borderColor = "red";
        tipoInput.style.boxShadow = "0 0 0 3px rgba(255, 0, 0, 0.2)";
        if (!firstErrorField) firstErrorField = tipoInput;
        isValid = false;
      } else if (tipoInput) {
        validateUserType();
      }

      // Focar no primeiro campo com erro
      if (!isValid && firstErrorField) {
        firstErrorField.focus();

        // Scroll suave para o campo com erro
        firstErrorField.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }

      return isValid;
    });

    // Resetar estilos quando o usuário começa a corrigir
    senhaInput.addEventListener("input", function () {
      if (this.value.length >= 7) {
        this.style.borderColor = "";
        this.style.boxShadow = "";
      }
    });

    if (confirmeSenhaInput) {
      confirmeSenhaInput.addEventListener("input", function () {
        if (this.value === senhaInput.value) {
          this.style.borderColor = "";
          this.style.boxShadow = "";
        }
      });
    }

    if (tipoInput) {
      tipoInput.addEventListener("change", function () {
        if (this.value) {
          this.style.borderColor = "";
          this.style.boxShadow = "";
        }
      });
    }
  }
});
