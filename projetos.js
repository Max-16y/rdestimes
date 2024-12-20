document.addEventListener("DOMContentLoaded", function () {
  // Obter publicações do Local Storage
  const publications = JSON.parse(localStorage.getItem("publications")) || [];

  // Selecionar o container de publicações
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