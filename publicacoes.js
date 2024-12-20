document.addEventListener("DOMContentLoaded", function () {
  // Carregar publicações do Local Storage
  const publications = JSON.parse(localStorage.getItem("publications")) || [];

  // Selecionar o container onde as publicações serão exibidas na página projetos.html
  const container = document.getElementById("publicationsContainer");

  // Adicionar cada publicação ao container
  publications.forEach((publication) => {
    const publicationElement = document.createElement("div");
    publicationElement.className = "publication";

    publicationElement.innerHTML = `
      <h3>${publication.title}</h3>
      <p>${publication.content}</p>
      ${publication.mediaURL ? renderMedia(publication.mediaURL) : ''}
      <p><small>Publicado em: ${new Date(publication.date).toLocaleString()}</small></p>
    `;

    container.appendChild(publicationElement);
  });
});

// Função para renderizar mídia (imagem ou vídeo)
function renderMedia(mediaURL) {
  if (mediaURL.match(/\.(jpeg|jpg|gif|png)$/i)) {
    return `<img src="${mediaURL}" alt="Mídia da Publicação" class="media-preview">`;
  } else if (mediaURL.match(/\.(mp4|webm|ogg)$/i)) {
    return `<video controls class="media-preview">
              <source src="${mediaURL}" type="video/mp4">
              Seu navegador não suporta vídeos.
            </video>`;
  }
  return '';
}

// Função para salvar publicação no LocalStorage
function savePublication(event) {
  event.preventDefault(); // Impede o envio padrão do formulário

  // Obter os valores do formulário
  const title = document.getElementById('titulo').value;
  const content = document.getElementById('conteudo').value;
  const category = document.getElementById('categoria').value;
  const mediaURL = document.getElementById('media-url').value;

  // Obter publicações existentes do LocalStorage
  const publications = JSON.parse(localStorage.getItem('publications')) || [];

  // Criar um novo objeto de publicação
  const newPublication = {
    id: new Date().getTime(), // ID único baseado no timestamp
    title,
    content,
    category,
    mediaURL,
    date: new Date().toISOString()
  };

  // Adicionar a nova publicação à lista
  publications.push(newPublication);

  // Salvar de volta no LocalStorage
  localStorage.setItem('publications', JSON.stringify(publications));

  // Limpar o formulário
  document.getElementById('publication-form').reset();

  // Recarregar as publicações na página projetos.html
  loadPublications();
}

// Função para carregar as publicações e exibir na página
function loadPublications() {
  const publications = JSON.parse(localStorage.getItem('publications')) || [];
  const container = document.getElementById('publicationsContainer');
  container.innerHTML = '';

  publications.forEach(publication => {
    const publicationElement = document.createElement('div');
    publicationElement.className = 'publication';

    publicationElement.innerHTML = `
      <h3>${publication.title}</h3>
      <p>${publication.content}</p>
      ${publication.mediaURL ? renderMedia(publication.mediaURL) : ''}
      <p><small>Publicado em: ${new Date(publication.date).toLocaleString()}</small></p>
    `;

    container.appendChild(publicationElement);
  });
}

// Inicializar a página com as publicações
document.addEventListener('DOMContentLoaded', function () {
  loadPublications();
});