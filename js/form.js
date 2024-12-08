document.getElementById('form-perfil').addEventListener('submit', async function (event) {
    event.preventDefault();

    const token = localStorage.getItem('token');
    const id_usuario = localStorage.getItem('id_usuario');

    if (!token) {
        alert('Usuário não autenticado');
        window.location.href = './login.html';
        return;
    }

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
    formData.append('id_usuario', id_usuario);

    // Adicionando os arquivos de imagem ao FormData
    const fileIconInput = document.getElementById('file_icon');
    const fileBannerInput = document.getElementById('file_banner');
    if (fileIconInput.files[0]) {
        formData.append('file_icon', fileIconInput.files[0]);
    }
    if (fileBannerInput.files[0]) {
        formData.append('file_banner', fileBannerInput.files[0]);
    }

    try {
        const response = await fetch('http://localhost:3000/submit-form', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const data = await response.json();
        if (data.message) {
            alert('Perfil criado com sucesso!');
        } else {
            alert('Erro ao criar perfil');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao enviar os dados');
    }
});