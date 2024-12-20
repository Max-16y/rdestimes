// Alternar entre as seções do painel
function showSection(sectionId) {
  const sections = document.querySelectorAll('.section-content');
  sections.forEach(section => (section.style.display = 'none'));

  const activeSection = document.getElementById(sectionId);
  if (activeSection) {
    activeSection.style.display = 'block';
  }

  const links = document.querySelectorAll('.sidebar ul li a');
  links.forEach(link => link.classList.remove('active'));

  const activeLink = document.querySelector(`.sidebar ul li a[onclick="showSection('${sectionId}')"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }
}

// Alternar o menu em dispositivos móveis
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('open');
}

// Salvar publicação no LocalStorage com suporte a mídia
function savePublication(event) {
  event.preventDefault();

  const title = document.getElementById('titulo').value;
  const content = document.getElementById('conteudo').value;
  const category = document.getElementById('categoria').value;
  const mediaURL = document.getElementById('media-url').value;

  const publications = JSON.parse(localStorage.getItem('publications')) || [];
  const newPublication = {
    id: new Date().getTime(),
    title,
    content,
    category,
    mediaURL,
    date: new Date().toISOString(),
  };

  publications.push(newPublication);
  localStorage.setItem('publications', JSON.stringify(publications));

  loadPublications();
  document.getElementById('publication-form').reset();
}

// Carregar e exibir publicações no painel principal
function loadPublications() {
  const publications = JSON.parse(localStorage.getItem('publications')) || [];
  const publicationsContainer = document.querySelector('.cards-container');
  publicationsContainer.innerHTML = '';

  publications.sort((a, b) => new Date(b.date) - new Date(a.date));

  publications.forEach(pub => {
    const pubElement = document.createElement('div');
    pubElement.classList.add('card');
    pubElement.innerHTML = `
      <strong>${pub.title}</strong>
      <p>${pub.content}</p>
      <small>Categoria: ${pub.category}</small>
      ${pub.mediaURL ? renderMedia(pub.mediaURL) : ''}
      <button onclick="deletePublication(${pub.id})">Deletar</button>
    `;
    publicationsContainer.appendChild(pubElement);
  });
}

// Renderizar mídia (imagem ou vídeo)
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

// Excluir publicação
function deletePublication(id) {
  const publications = JSON.parse(localStorage.getItem('publications')) || [];
  const updatedPublications = publications.filter(pub => pub.id !== id);
  localStorage.setItem('publications', JSON.stringify(updatedPublications));
  loadPublications();
}

// Carregar publicações na página projetos.html
function loadProjectsPage() {
  const publications = JSON.parse(localStorage.getItem('publications')) || [];
  const projectsContainer = document.querySelector('.projects-container');
  projectsContainer.innerHTML = '';

  publications.forEach(pub => {
    const projectElement = document.createElement('div');
    projectElement.classList.add('project-card');
    projectElement.innerHTML = `
      <h3>${pub.title}</h3>
      <p>${pub.content}</p>
      <small>Categoria: ${pub.category}</small>
      ${pub.mediaURL ? renderMedia(pub.mediaURL) : ''}
    `;
    projectsContainer.appendChild(projectElement);
  });
}

// Inicializar o painel ao carregar a página
document.addEventListener('DOMContentLoaded', function () {
  if (document.body.id === 'dashboard') {
    loadPublications();
  } else if (document.body.id === 'projects') {
    loadProjectsPage();
  }
});

// Editar uma publicação
function editPublication(id) {
  const publications = JSON.parse(localStorage.getItem('publications')) || [];
  const publication = publications.find(pub => pub.id === id);

  if (publication) {
    document.getElementById('titulo').value = publication.title;
    document.getElementById('conteudo').value = publication.content;
    document.getElementById('categoria').value = publication.category;

    document.getElementById('publication-form').onsubmit = function (event) {
      event.preventDefault();
      updatePublication(id);
    };

    showSection('create');
  }
}

// Atualizar uma publicação
function updatePublication(id) {
  const publications = JSON.parse(localStorage.getItem('publications')) || [];
  const index = publications.findIndex(pub => pub.id === id);

  if (index !== -1) {
    publications[index] = {
      ...publications[index],
      title: document.getElementById('titulo').value,
      content: document.getElementById('conteudo').value,
      category: document.getElementById('categoria').value,
    };

    localStorage.setItem('publications', JSON.stringify(publications));
    loadPublications();
    document.getElementById('publication-form').onsubmit = savePublication;
    document.getElementById('publication-form').reset();
    showSection('publications');
  }
}

// Atualizar o contador de publicações
function updatePublicationCount() {
  const publications = JSON.parse(localStorage.getItem('publications')) || [];
  const publicationCountElement = document.getElementById('publication-count');
  publicationCountElement.innerText = `Total de Publicações: ${publications.length}`;
}

// Salvar configurações no LocalStorage
function saveSettings() {
  const siteName = document.getElementById('site-name').value;
  const siteDescription = document.getElementById('site-description').value;

  const settings = { siteName, siteDescription };
  localStorage.setItem('settings', JSON.stringify(settings));
  alert('Configurações salvas!');
}

// Carregar configurações do LocalStorage
function loadSettings() {
  const settings = JSON.parse(localStorage.getItem('settings')) || {};
  document.getElementById('site-name').value = settings.siteName || '';
  document.getElementById('site-description').value = settings.siteDescription || '';
}

// Inicializar o painel ao carregar a página
document.addEventListener('DOMContentLoaded', function () {
  loadSettings();
  loadPublications();
  updatePublicationCount();
  showSection('dashboard');
});