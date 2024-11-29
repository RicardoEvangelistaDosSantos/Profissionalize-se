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
      alert(result.mensagem);
    } else {
      alert(`Erro: ${result.mensagem}`);
    }
  } catch (err) {
    alert("Erro ao se conectar ao servidor.");
  }
});

document.getElementById("registrar").addEventListener("click", async () => {
  const nome_completo = document.getElementById("nome-cadastro").value;
  const email = document.getElementById("email-cadastro").value;
  const cpf = document.getElementById("cpf-cadastro").value;
  const senha = document.getElementById("senha-cadastro").value;
  if (!nome_completo|| !email || !cpf || !senha) {
    alert("Preencha todos os campos!");
    return;
  }
  try {
    const response = await fetch("http://localhost:3000/registrar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({  nome_completo, email, cpf, senha  }),
    });
    const result = await response.json();
    if (response.ok) {
      alert(result.mensagem);
    } else {
      alert(`Erro: ${result.mensagem}`);
    }
  } catch (err) {
    alert("Erro ao se conectar ao servidor.");
  }
});
