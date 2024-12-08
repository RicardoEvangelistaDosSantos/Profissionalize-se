document.getElementById("login").addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    if (!email || !senha) {
        alert("Preencha todos os campos!");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, senha }),
        });
        const result = await response.json();
        if (response.ok) {
            localStorage.setItem('token', result.token);
            localStorage.setItem('id_usuario', result.id_usuario);
            alert(result.mensagem);
            window.location.href = "../perfil.html";
        } else {
            alert(`Erro: ${result.mensagem}`);
        }
    } catch (err) {
        alert("Erro ao se conectar ao servidor.");
    }
});