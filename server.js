// Função para alternar entre as seções
function showSection(sectionId) {
  const sections = document.querySelectorAll('.section-content');
  sections.forEach(section => {
    section.style.display = 'none';
  });

  const activeSection = document.getElementById(sectionId);
  if (activeSection) {
    activeSection.style.display = 'block';
  }

  const links = document.querySelectorAll('.sidebar ul li a');
  links.forEach(link => {
    link.classList.remove('active');
  });

  const activeLink = document.querySelector(`.sidebar ul li a[onclick="showSection('${sectionId}')"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }
}

// Função para alternar o menu em dispositivos móveis
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('open');
}

// Função para salvar publicações no LocalStorage
function savePublication(title, content, category) {
  const publications = JSON.parse(localStorage.getItem('publications')) || [];
  const newPublication = {
    id: new Date().getTime(),
    title,
    content,
    category,
    date: new Date().toISOString(),
  };

  publications.push(newPublication);
  localStorage.setItem('publications', JSON.stringify(publications));
  updatePublicationCount(); // Atualiza o contador
}

// Função para carregar publicações e exibi-las na página
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
      <button onclick="editPublication(${pub.id})">Editar</button>
      <button onclick="confirmDeletePublication(${pub.id})">Deletar</button>
    `;
    publicationsContainer.appendChild(pubElement);
  });
}

// Função para editar publicação
function editPublication(id) {
  const publications = JSON.parse(localStorage.getItem('publications')) || [];
  const publication = publications.find(pub => pub.id === id);

  if (publication) {
    document.getElementById('titulo').value = publication.title;
    document.getElementById('conteudo').value = publication.content;
    document.getElementById('categoria').value = publication.category;
    document.getElementById('publication-form').onsubmit = function(event) {
      event.preventDefault();
      updatePublication(id);
    };
  }
}

// Função para atualizar uma publicação
function updatePublication(id) {
  const publications = JSON.parse(localStorage.getItem('publications')) || [];
  const index = publications.findIndex(pub => pub.id === id);

  if (index !== -1) {
    publications[index] = {
      id,
      title: document.getElementById('titulo').value,
      content: document.getElementById('conteudo').value,
      category: document.getElementById('categoria').value,
      date: publications[index].date,
    };

    localStorage.setItem('publications', JSON.stringify(publications));
    loadPublications();
    showSection('publications');
  }
}

// Função para confirmar exclusão
function confirmDeletePublication(id) {
  if (confirm('Tem certeza que deseja deletar essa publicação?')) {
    deletePublication(id);
  }
}

// Função para deletar publicação
function deletePublication(id) {
  let publications = JSON.parse(localStorage.getItem('publications')) || [];
  publications = publications.filter(pub => pub.id !== id);
  localStorage.setItem('publications', JSON.stringify(publications));
  loadPublications();
}

// Função para salvar configurações
function saveSettings() {
  const siteName = document.getElementById('site-name').value;
  const siteDescription = document.getElementById('site-description').value;

  const settings = {
    siteName,
    siteDescription,
  };

  localStorage.setItem('settings', JSON.stringify(settings));
  alert('Configurações salvas!');
}

// Função para carregar configurações
function loadSettings() {
  const settings = JSON.parse(localStorage.getItem('settings')) || {};
  document.getElementById('site-name').value = settings.siteName || '';
  document.getElementById('site-description').value = settings.siteDescription || '';
}

// Atualização do contador de publicações
function updatePublicationCount() {
  const publications = JSON.parse(localStorage.getItem('publications')) || [];
  const publicationCountElement = document.getElementById('publication-count');
  if (publicationCountElement) {
    publicationCountElement.innerText = `Total de Publicações: ${publications.length}`;
  }
}

// Inicialização ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
  loadSettings();
  loadPublications();
  updatePublicationCount();
});