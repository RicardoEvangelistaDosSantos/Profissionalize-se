document.getElementById('form-perfil').addEventListener('submit', function (event) {
    event.preventDefault(); // Impede o envio tradicional do formulário

    // Criar FormData para enviar arquivos e dados ao servidor
    const formData = new FormData();
    formData.append('nome', document.getElementById('nome').value);
    formData.append('sobrenome', document.getElementById('sobrenome').value);
    formData.append('formacao', document.getElementById('formacao').value);
    formData.append('resumo', document.getElementById('resumo').value);
    formData.append('experiencia', document.getElementById('experiencia').value);
    formData.append('telefone', document.getElementById('telefone').value);
    formData.append('dt_nasc', document.getElementById('data-nascimento').value);
    formData.append('estado', document.getElementById('id_estado').value);
    formData.append('cidade', document.getElementById('id_cidade').value);
    formData.append('cor_fundo', document.getElementById('inputColor').value);

    // Adicionar as fotos de perfil e capa
    formData.append('foto_perfil', document.getElementById('file_icon').files[0]);
    formData.append('foto_capa', document.getElementById('file_banner').files[0]);
    
    // ID do usuário (no backend você pegará o id do usuário logado)
    formData.append('id_usuario', id_usuario);

    // Enviar os dados para o servidor
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
