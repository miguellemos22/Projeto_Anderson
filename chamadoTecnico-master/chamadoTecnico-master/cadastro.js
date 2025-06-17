document.getElementById("cadastroForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const nome = document.getElementById("nome").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const tipo = document.getElementById("tipo").value.trim();

    const successMessage = document.getElementById("successMessage");
    const errorMessage = document.getElementById("errorMessage");

    // Validação
    if (email === "" || nome === "" || senha === "" || tipo === "") {
        errorMessage.textContent = "Todos os campos são obrigatórios.";
        successMessage.textContent = "";
        return;
    }

    if (!email.includes("@") || !email.includes(".")) {
        errorMessage.textContent = "Email inválido.";
        successMessage.textContent = "";
        return;
    }

    // Criar objeto usuário
    const novoUsuario = {
        email: email,
        nome: nome,
        senha: senha,
        tipo: tipo
    };

    fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(novoUsuario)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro ao cadastrar usuário");
        }
        return response.json();
    })
    .then(data => {
        successMessage.textContent = data.mensagem;
        errorMessage.textContent = "";

        // Limpar formulário
        document.getElementById("cadastroForm").reset();

        // Redirecionar após 1 segundo
        setTimeout(() => {
            window.location.href = "login.html";
        }, 3000);
    })
    .catch(error => {
        errorMessage.textContent = error.message;
        successMessage.textContent = "";
    });
});