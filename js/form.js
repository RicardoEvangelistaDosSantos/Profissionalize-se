document.getElementById('form-perfil').addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar o envio tradicional do formulário

    // Capturando os dados do formulário
    const nome = document.getElementById('nome').value;
    const sobrenome = document.getElementById('sobrenome').value;
    const formacao = document.getElementById('formacao').value;
    const resumo = document.getElementById('resumo').value;
    const experiencia = document.getElementById('experiencia').value;
    const telefone = document.getElementById('telefone').value;
    const dt_nasc = document.getElementById('data-nascimento').value;
    const estado = document.getElementById('id_estado').value;
    const cidade = document.getElementById('id_cidade').value;
    const cor_fundo = document.getElementById('inputColor').value;
    const foto_perfil = document.getElementById('file_icon').files[0];  // Arquivo de foto de perfil
    const foto_capa = document.getElementById('file_banner').files[0];  // Arquivo de foto de capa

    // Verificando se os arquivos foram selecionados (opcional)
    let formData = new FormData();
    formData.append("nome", nome);
    formData.append("sobrenome", sobrenome);
    formData.append("formacao", formacao);
    formData.append("resumo", resumo);
    formData.append("experiencia", experiencia);
    formData.append("telefone", telefone);
    formData.append("dt_nasc", dt_nasc);
    formData.append("estado", estado);
    formData.append("cidade", cidade);
    formData.append("cor_fundo", cor_fundo);
    formData.append("foto_perfil", foto_perfil);
    formData.append("foto_capa", foto_capa);
    const id_usuario = localStorage.getItem('id_usuario');
    formData.append("id_usuario", id_usuario);  // Exemplo de id do usuário

    // Enviar os dados para o servidor com fetch API
    fetch('http://localhost:3000/submit-form', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert('Perfil criado com sucesso!');
        } else {
            alert('Erro ao criar perfil');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao enviar os dados');
    });
});
