const id_estado = document.getElementById("id_estado");
const id_cidade = document.getElementById("id_cidade");
let cacheEstados = [];
let cacheCidades = {};

// cria os estados na seclect
fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome`)
    .then(result => result.json())
    .then(data => {
        cacheEstados = data; // guarda  Estadis em cache
        console.log("cEs: ",cacheEstados)
        data.forEach(estado => {
            id_estado.innerHTML += `
                <option value="${estado.sigla}">${estado.nome}</option>
            `;
        });
    });
   

function selectEstado() {
    const estado = id_estado.value;
    id_cidade.innerHTML = `<option value="">Carregando...</option>`;
   
    // Verifica se as cidades já estão em cache
    if (cacheCidades[estado]) {
        populateCidades(cacheCidades[estado]);
        console.log(cacheCidades[estado])
    } else {
        fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/distritos?orderBy=nome`)
            .then(result => result.json())
            .then(data => {
                cacheCidades[estado] = data; // Salva as cidades em cache
                populateCidades(data);
            });
    }
    console.log(id_estado.value)
}
//cria as Cidades no select
function populateCidades(cidades) {
    id_cidade.innerHTML = `<option value="">Selecione Cidade</option>`;
    cidades.forEach(cidade => {
        id_cidade.innerHTML += `
            <option value="${cidade.nome}">${cidade.nome}</option>
        `;
    });
}
function selectCidade() {return id_cidade.value }




console.log("valor cidade",id_cidade.value,"nome cidade",id_cidade.textContent)



