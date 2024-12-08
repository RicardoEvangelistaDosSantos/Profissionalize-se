document.getElementById("registrar").addEventListener("click", async (event) => {
  // Evitar o envio do formulário se alguma verificação falhar
  event.preventDefault();

  const nome_completo = document.getElementById("nome-cadastro").value;
  const email = document.getElementById("email-cadastro").value;
  const cpf = document.getElementById("cpf-cadastro").value;
  const senha = document.getElementById("senha-cadastro").value;
  const senha_confirmada = document.getElementById("senha-confirmada").value;
  const termos_privacidade = document.getElementById("termos-privacidade").checked;
  const termos_uso = document.getElementById("termos-uso").checked;

  // Verificar se todos os campos obrigatórios foram preenchidos
  if (!nome_completo || !email || !cpf || !senha || !senha_confirmada) {
    alert("Preencha todos os campos!");
    return;
  }
  // Validação do e-mail (formato básico)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Por favor, insira um e-mail válido.");
    return;
  }
  // Validação do CPF (deve ter 11 números)
  if (!/^\d{11}$/.test(cpf)) {
    alert("O CPF deve conter 11 números.");
    return;
  }
  // Validação da senha (comparar com a confirmação da senha)
  if (senha !== senha_confirmada) {
    alert("As senhas não coincidem.");
    return;
  }
  // Verificar se as caixas de termos de privacidade e termos de uso estão marcadas
  if (!termos_privacidade || !termos_uso) {
    alert("Você deve aceitar os Termos de Privacidade e os Termos de Uso.");
    return;
  }
  try {
    const response = await fetch("http://localhost:3000/registrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome_completo, email, cpf, senha }),
    });
    const result = await response.json();
    if (response.ok) {
        localStorage.setItem('id_usuario', result.id_usuario);
        alert(result.mensagem);
        window.location.href = "../login.html";
    } else {
        alert(`Erro: ${result.mensagem}`);
    }
  } catch (err) {
    alert("Erro ao se conectar ao servidor.");
  }
});
