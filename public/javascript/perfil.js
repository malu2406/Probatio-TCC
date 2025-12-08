async function carregarUsuario() {
        const res = await fetch("/api/usuario");
        const user = await res.json();

        document.getElementById("nome").innerText = user.nome;
        document.getElementById("email").innerText = user.email;
        document.getElementById("nickname").innerText = user.nickname;
        console.log(user.nickname);
      }

      carregarUsuario();

      document.addEventListener("DOMContentLoaded", function () {
          // Carregar dados do usuário
          fetch("/api/usuario")
            .then((response) => response.json())
            .then((data) => {
              document.getElementById("nomeUsuario").textContent = data.nickname;

              // Verificar se o usuário é bolsista e mostrar o link de Matérias
              if (data.tipo === "BOLSISTA") {
                const linkMaterias = document.getElementById("link-materias");
                linkMaterias.style.display = "block";

                // Adicionar indicador visual no título
                const saudacao = document.querySelector(".saudacao h1");
                const badge = document.createElement("span");
                badge.className = "badge-bolsista";
                badge.textContent = "Bolsista";
                saudacao.appendChild(badge);
              }
            })
            .catch((error) => {
              console.error("Erro ao carregar dados do usuário:", error);
            });

          // Gerar gráfico na página inicial
          generateChartInicio();
        });