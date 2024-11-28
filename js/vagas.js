// Função para calcular há quanto tempo uma vaga foi postada
function calcularTempoPostagem(dataPostagem) {
    const datePostagem = new Date(dataPostagem);
    const hoje = new Date();
    // Calculando a diferença em milissegundos
    const diffMs = hoje - datePostagem;
    // Convertendo para dias
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    // Formatar "há X tempo"
    if (diffDias < 1) {
        return 'Postada hoje';
    } else if (diffDias === 1) {
        return 'Postada há 1 dia';
    } else if (diffDias < 7) {
        return `Postada há ${diffDias} dias`;
    } else if (diffDias < 30) {
        const semanas = Math.floor(diffDias / 7);
        return semanas === 1 
            ? 'Postada há 1 semana' 
            : `Postada há ${semanas} semanas`;
    } else {
        const meses = Math.floor(diffDias / 30);
        return meses === 1 
            ? 'Postada há 1 mês' 
            : `Postada há ${meses} meses`;
    }
}

// Função para carregar as vagas
function loadVagas() {
    fetch('http://localhost:3000/api/vagas')
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('section-vaga');
            list.innerHTML = '';
            data.forEach(vaga => {
                const tempoPostagem = calcularTempoPostagem(vaga.dt_postagem);
                list.innerHTML +=
                    `<div class="vaga">
                        <div class="header-vaga">
                                <div>
                                <h4>${vaga.empresa}</h4>
                                <h2>${vaga.titulo}</h2>
                                <p>${vaga.tipo_contratacao}/${vaga.localizacao}</p>
                            </div>
                                <p>${tempoPostagem}</span>
                        </div>
                        <div class="body-vaga">
                            <p>${vaga.descricao}</p>
                            <p><a href="${vaga.url_vaga}" target="_blank">Ver mais detalhes</a></p>
                        </div>
                        <div class="footer-vaga">
                            <p>${vaga.status_vaga}</p>
                        </div>
                    </div>`;
            });
        })
        .catch(err => console.error('Erro ao carregar as vagas:', err));
}

loadVagas();