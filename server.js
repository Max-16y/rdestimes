// Alternar entre as seções do painel
function showSection(sectionId) {
  const sections = document.querySelectorAll('.section-content');
  sections.forEach(section => section.style.display = 'none');

  const activeSection = document.getElementById(sectionId);
  if (activeSection) activeSection.style.display = 'block';

  const links = document.querySelectorAll('.sidebar ul li a');
  links.forEach(link => link.classList.remove('active'));

  const activeLink = document.querySelector(`.sidebar ul li a[data-section="${sectionId}"]`);
  if (activeLink) activeLink.classList.add('active');
}

// Alternar o menu em dispositivos móveis
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('open');
}

// Salvar publicação no LocalStorage com suporte a mídia
function savePublication(event) {
  event.preventDefault();

  const title = document.getElementById('titulo').value.trim();
  const content = document.getElementById('conteudo').value.trim();
  const category = document.getElementById('categoria').value.trim();
  const mediaURL = document.getElementById('media-url').value.trim();

  if (!title || !content) {
    alert("Título e conteúdo são obrigatórios.");
    return;
  }

  const publications = JSON.parse(localStorage.getItem('publications')) || [];
  const newPublication = {
    id: Date.now(),
    title,
    content,
    category,
    mediaURL,
    date: new Date().toISOString(),
  };

  publications.push(newPublication);
  localStorage.setItem('publications', JSON.stringify(publications));
  document.getElementById('publication-form').reset();
  loadPublications();
}

// Carregar e exibir publicações no painel principal
function loadPublications() {
  const publications = JSON.parse(localStorage.getItem('publications')) || [];
  const publicationsContainer = document.querySelector('.cards-container');
  publicationsContainer.innerHTML = '';

  publications.sort((a, b) => new Date(b.date) - new Date(a.date));

  publications.forEach(pub => {
    const pubElement = document.createElement('div');
    pubElement.className = 'card';
    pubElement.innerHTML = `
      <strong>${pub.title}</strong>
      <p>${pub.content}</p>
      <small>Categoria: ${pub.category}</small>
      ${pub.mediaURL ? renderMedia(pub.mediaURL) : ''}
      <button onclick="deletePublication(${pub.id})">Deletar</button>
    `;
    publicationsContainer.appendChild(pubElement);
  });

  updatePublicationCount();
}

// Renderizar mídia (imagem ou vídeo)
function renderMedia(mediaURL) {
  if (/\.(jpeg|jpg|gif|png)$/i.test(mediaURL)) {
    return `<img src="${mediaURL}" alt="Mídia da Publicação" class="media-preview">`;
  } else if (/\.(mp4|webm|ogg)$/i.test(mediaURL)) {
    return `<video controls class="media-preview">
              <source src="${mediaURL}" type="video/mp4">
              Seu navegador não suporta vídeos.
            </video>`;
  }
  return '';
}

// Excluir publicação
function deletePublication(id) {
  const publications = JSON.parse(localStorage.getItem('publications')) || [];
  const updatedPublications = publications.filter(pub => pub.id !== id);
  localStorage.setItem('publications', JSON.stringify(updatedPublications));
  loadPublications();
}

// Inicializar o painel
document.addEventListener('DOMContentLoaded', () => {
  if (document.body.id === 'dashboard') {
    loadPublications();
  }
});
