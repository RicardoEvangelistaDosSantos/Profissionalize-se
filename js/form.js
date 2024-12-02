document.getElementById('form-perfil').addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar o envio tradicional do formulário

    // Capturando os dados do formulário
    const nome = document.getElementById('nome').value;
    const sobrenome = document.getElementById('sobrenome').value;
    const formacao = document.getElementById('escolaridade').value;
    const descricao = document.getElementById('experiencia').value;
    const telefone = document.getElementById('telefone').value;
    const dt_nasc = document.getElementById('data-nascimento').value;
    const estado = document.getElementById('id_estado').value;
    const cidade = document.getElementById('id_cidade').value;
    const cor_fundo = document.getElementById('inputColor').value;
    const foto_perfil = document.getElementById('file_icon').files[0];  // Arquivo de foto de perfil
    const foto_capa = document.getElementById('file_banner').files[0];  // Arquivo de foto de capa

    // Verificando se os arquivos foram selecionados (opcional)
    let foto_perfil_url = '';
    let foto_capa_url = '';
    
    if (foto_perfil) {
        foto_perfil_url = URL.createObjectURL(foto_perfil);
    }

    if (foto_capa) {
        foto_capa_url = URL.createObjectURL(foto_capa);
    }

    // Dados que vamos enviar para o servidor
    const data = {
        nome,
        sobrenome,
        formacao,
        descricao,
        telefone,
        dt_nasc,
        estado,
        cidade,
        cor_fundo,
        foto_perfil: foto_perfil_url,  // Pode enviar a URL do arquivo ou o nome do arquivo se o backend aceitar
        foto_capa: foto_capa_url,      // O mesmo vale para foto_capa
        id_usuario: 1  // Aqui você deve pegar o id do usuário logado, por exemplo, do contexto do servidor
    };

    // Enviando os dados para o servidor com fetch API
    fetch('http://localhost:3000/submit-form', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
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
