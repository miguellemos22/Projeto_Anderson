document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, senha })
    })
    .then(response => response.json())
    .then(data => {
        if (data.mensagem) {
            alert(data.mensagem);
            // Redireciona ou guarda o usuário em sessão/localStorage se quiser
            localStorage.setItem("usuarioLogado", JSON.stringify(data.usuario));
            window.location.href = "dashboard.html";
        } else {
            alert(data.erro);
        }
    })
    .catch(error => {
        console.error("Erro ao tentar login:", error);
    });
});
