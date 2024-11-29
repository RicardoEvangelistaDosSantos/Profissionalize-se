
//#region SELECTION CIDADE E ESTADO
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

//#endregion

//#region INPUT IMAGEM (BANNER E ICONE)

/*banner*/
const inputFile = document.querySelector("#file_banner");
const sect = document.querySelector(".section-1");
const sec_cut = document.querySelector(".section-cut");
const cropperContainer = document.getElementById("cropper-container");
const cropperImage = document.getElementById("cropper-image");
const cropButton = document.getElementById("crop-button");
const cancelButton = document.getElementById("cancel-button");

let cropper = null;

inputFile.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = function (event) {
      cropperImage.src = event.target.result; // Define a imagem no elemento <img>
      sec_cut.style.display = "block";
      cropperContainer.style.display = "block"; // Mostra o container do cropper
      // Inicializa o cropper.js
      cropper = new Cropper(cropperImage, {
        aspectRatio: 16 / 9, // Proporção do recorte (opcional)
        viewMode: 1,
        autoCropArea: 0.8,
      });
        // Rolagem para a section-cut
        sec_cut.scrollIntoView({
            behavior: 'smooth', // Rolagem suave
            block: 'center' // Alinha o item no centro da tela
        });
    };



    reader.readAsDataURL(file);
  }

  // Reseta o valor do input para permitir seleção do mesmo arquivo
  inputFile.value = "";
});

// Ação ao clicar no botão "Recortar"
cropButton.addEventListener("click", function () {
  if (cropper) {
    const croppedImage = cropper.getCroppedCanvas().toDataURL("image/png"); // Obtém a imagem recortada
    sect.style.backgroundImage = `url('${croppedImage}')`; // Define como fundo
    cropper.destroy(); // Remove o cropper
    cropper = null; // Reseta a instância do cropper
    sec_cut.style.display = "none";
    cropperContainer.style.display = "none"; // Esconde o container

  }
});

// Ação ao clicar no botão "Cancelar"
cancelButton.addEventListener("click", function () {
  if (cropper) {
    cropper.destroy(); // Remove o cropper
    cropper = null; // Reseta a instância do cropper
    sec_cut.style.display = "none";
    cropperContainer.style.display = "none"; // Esconde o container
  }
});




/*icone*/

//#endregion