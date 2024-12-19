// Função para alternar entre as seções
function showSection(sectionId) {
  // Oculta todas as seções
  const sections = document.querySelectorAll('.section-content');
  sections.forEach(section => {
    section.style.display = 'none';
  });

  // Exibe a seção selecionada
  const activeSection = document.getElementById(sectionId);
  if (activeSection) {
    activeSection.style.display = 'block';
  } else {
    console.warn(`Seção com ID "${sectionId}" não encontrada.`);
  }

  // Atualiza a navegação
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
  sidebar.classList.toggle('open'); // Abre ou fecha o menu lateral
}

// Função para salvar as publicações no LocalStorage
function savePublication(title, content, category) {
  const publications = JSON.parse(localStorage.getItem('publications')) || [];
  const newPublication = {
    id: new Date().getTime(),
    title,
    content,
    category,
    date: new Date().toISOString()
  };

  publications.push(newPublication);
  localStorage.setItem('publications', JSON.stringify(publications));
}

// Função para carregar as publicações e exibi-las na página
function loadPublications() {
  const publications = JSON.parse(localStorage.getItem('publications')) || [];
  const publicationsContainer = document.querySelector('.cards-container');
  publicationsContainer.innerHTML = ''; // Limpar antes de adicionar novas publicações

  publications.sort((a, b) => new Date(b.date) - new Date(a.date)); // Ordenar do mais recente para o mais antigo

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

  // Atualiza o total de publicações no Dashboard
  const statBox = document.querySelector('.stat-box');
  if (statBox) {
    statBox.innerText = `Total de Publicações: ${publications.length}`;
  }
}

// Função para exibir o formulário de edição
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

// Função para atualizar a publicação no LocalStorage
function updatePublication(id) {
  const publications = JSON.parse(localStorage.getItem('publications')) || [];
  const index = publications.findIndex(pub => pub.id === id);

  if (index !== -1) {
    const updatedPub = {
      id,
      title: document.getElementById('titulo').value,
      content: document.getElementById('conteudo').value,
      category: document.getElementById('categoria').value,
      date: publications[index].date
    };

    publications[index] = updatedPub;
    localStorage.setItem('publications', JSON.stringify(publications));
    loadPublications(); // Recarregar as publicações
    showSection('publications'); // Voltar para a seção de publicações
  }
}

// Função para confirmar a exclusão de uma publicação
function confirmDeletePublication(id) {
  if (confirm('Tem certeza que deseja deletar essa publicação?')) {
    deletePublication(id);
  }
}

// Função para excluir uma publicação
function deletePublication(id) {
  let publications = JSON.parse(localStorage.getItem('publications')) || [];
  publications = publications.filter(pub => pub.id !== id);
  localStorage.setItem('publications', JSON.stringify(publications));
  loadPublications(); // Recarregar as publicações
}

// Função para salvar as configurações no LocalStorage
function saveSettings() {
  const siteName = document.getElementById('site-name').value;
  const siteDescription = document.getElementById('site-description').value;

  const settings = {
    siteName,
    siteDescription
  };

  localStorage.setItem('settings', JSON.stringify(settings));
  alert('Configurações salvas!');
}

// Função para carregar as configurações do LocalStorage
function loadSettings() {
  const settings = JSON.parse(localStorage.getItem('settings')) || {};
  document.getElementById('site-name').value = settings.siteName || '';
  document.getElementById('site-description').value = settings.siteDescription || '';
}

// Inicializar com o Dashboard ativo e carregar dados
document.addEventListener('DOMContentLoaded', function() {
  showSection('dashboard'); // Carregar a seção de Dashboard por padrão

  loadPublications(); // Carregar as publicações ao carregar a página

  // Atualizar as estatísticas do Dashboard
  const publications = JSON.parse(localStorage.getItem('publications')) || [];
  const totalPublications = publications.length;
  const activeUsers = countActiveUsers(); // Corrigido: Chamar a função countActiveUsers()

  // Atualizar as estatísticas no Dashboard
  const statsContainer = document.querySelector('.stat-box');
  if (statsContainer) {
    statsContainer.innerText = `Total de Publicações: ${totalPublications}`;
  }

  loadSettings(); // Carregar as configurações ao carregar a página
});

function saveUser(username, email) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const newUser = {
    id: new Date().getTime(),
    username,
    email,
    active: true // Pode ser alterado conforme a necessidade
  };

  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
}

function countActiveUsers() {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  return users.filter(user => user.active).length;
}