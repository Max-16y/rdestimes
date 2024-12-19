document.addEventListener('DOMContentLoaded', function() {
  // Animações de zoom nas imagens da galeria
  const galeriaImages = document.querySelectorAll('.projetos img');
  galeriaImages.forEach(image => {
    image.addEventListener('mouseover', () => {
      image.style.transform = "scale(1.1)";
    });

    image.addEventListener('mouseout', () => {
      image.style.transform = "scale(1)";
    });
  });

  // Mostrar ou esconder o botão "Voltar ao topo"
  const backToTop = document.getElementById("backToTop");
  window.onscroll = function() {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
      backToTop.style.display = "block";
    } else {
      backToTop.style.display = "none";
    }
  };

  // Rolar ao topo ao clicar no botão
  backToTop.addEventListener("click", function(e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Modo noturno
  const toggleButton = document.getElementById('toggle-dark-mode');
  const body = document.body;

  function toggleDarkMode() {
    body.classList.toggle('dark-mode');
    localStorage.setItem('dark-mode', body.classList.contains('dark-mode') ? 'enabled' : 'disabled');
  }

  if (localStorage.getItem('dark-mode') === 'enabled') {
    body.classList.add('dark-mode');
  }

  toggleButton.addEventListener('click', toggleDarkMode);

  // Comentários
  const formComentario = document.getElementById('form-comentario');
  const comentariosDiv = document.getElementById('comentarios');

  const salvarComentarios = () => {
    const comentarios = comentariosDiv.innerHTML;
    localStorage.setItem('comentarios', comentarios);
  };

  const carregarComentarios = () => {
    const comentariosSalvos = localStorage.getItem('comentarios');
    if (comentariosSalvos) {
      comentariosDiv.innerHTML = comentariosSalvos;
    }
  };

  formComentario.addEventListener('submit', (event) => {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const comentario = document.getElementById('comentario').value;

    const novoComentario = document.createElement('div');
    novoComentario.classList.add('comentario');
    novoComentario.innerHTML = `<strong>${nome}</strong><p>${comentario}</p>`;

    comentariosDiv.appendChild(novoComentario);
    salvarComentarios();
    formComentario.reset();
  });

  carregarComentarios();

  // Carrossel de imagens
  const carousel = document.querySelector('.carousel');
  const images = document.querySelectorAll('.carousel img');
  const prevButton = document.getElementById('prev');
  const nextButton = document.getElementById('next');

  let currentIndex = 0;
  const totalImages = images.length;

  function updateCarousel() {
    const offset = -currentIndex * 100;
    carousel.style.transform = `translateX(${offset}%)`;
  }

  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex === 0) ? totalImages - 1 : currentIndex - 1;
    updateCarousel();
  });

  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex === totalImages - 1) ? 0 : currentIndex + 1;
    updateCarousel();
  });

  window.addEventListener('resize', updateCarousel);

  // Barra de leitura
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;
    const readingBar = document.querySelector('.reading-bar');
    readingBar.style.width = `${scrollPercent}%`;
  });

  // Barra de pesquisa
  const searchInput = document.getElementById('search-input');
  const suggestionsList = document.getElementById('suggestions-list');

  const sampleSuggestions = ["HTML", "CSS", "JavaScript", "Web Design", "UX/UI"];

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    suggestionsList.innerHTML = '';

    if (query) {
      const filtered = sampleSuggestions.filter(item =>
        item.toLowerCase().includes(query)
      );

      filtered.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        li.addEventListener('click', () => {
          searchInput.value = item;
          suggestionsList.innerHTML = '';
        });
        suggestionsList.appendChild(li);
      });

      suggestionsList.style.display = 'block';
    } else {
      suggestionsList.style.display = 'none';
    }
  });

  document.querySelector('.search-bar').addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
      window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
    }
  });

  // Validação de login
  const adminUsername = "Max Victor";
  const adminPassword = ""; // Defina a senha do administrador

  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === adminUsername && password === adminPassword) {
      alert("Login bem-sucedido!");
      window.open("dashboard.html", "_blank");
    } else {
      alert("Usuário ou senha incorretos.");
    }
  });

  // Lista de e-mails permitidos
  const whitelistUsers = ['rdesgremio@gmail.com', 'maxvictor.am@gmail.com'];

  const userEmail = localStorage.getItem('userEmail');

  if (whitelistUsers.includes(userEmail)) {
    alert('Bem-vindo à área restrita!');
  } else {
    alert('Acesso negado. Você não está autorizado a acessar esta área.');
    window.location.href = 'login.html';
  }

  // Lista de credenciais autorizadas
  const authorizedUsers = [
    { username: "max", password: "12345" },
    { username: "superuser", password: "password123" }
  ];

  function validateLogin() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const user = authorizedUsers.find(user => user.username === username && user.password === password);

    if (user) {
      window.location.href = "dashboard.html";
    } else {
      document.getElementById("error-message").style.display = "block";
    }
  }
});

document.querySelector('.toggle-btn').addEventListener('click', function() {
  document.querySelector('.sidebar').classList.toggle('open');
});

// Simula o "banco de dados" usando localStorage
let publications = JSON.parse(localStorage.getItem('publications')) || [];

// Referências aos elementos do DOM
const cardsContainer = document.getElementById('cards-container');
const form = document.getElementById('publication-form');

// Função para renderizar as publicações na tela
function renderPublications() {
  cardsContainer.innerHTML = ''; // Limpa o container
  publications.forEach((pub, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <h4>${pub.titulo}</h4>
      <p>${pub.conteudo}</p>
      <div class="card-actions">
        <button class="btn-edit" onclick="editPublication(${index})">Editar</button>
        <button class="btn-delete" onclick="deletePublication(${index})">Excluir</button>
      </div>
    `;
    cardsContainer.appendChild(card);
  });
}

// Função para salvar uma nova publicação
form.addEventListener('submit', (event) => {
  event.preventDefault();

  // Captura os valores do formulário
  const titulo = document.getElementById('titulo').value;
  const conteudo = document.getElementById('conteudo').value;

  // Adiciona a nova publicação
  publications.push({ titulo, conteudo });
  localStorage.setItem('publications', JSON.stringify(publications)); // Salva no localStorage
  renderPublications(); // Atualiza a tela

  // Limpa o formulário
  form.reset();
});

// Função para excluir uma publicação
function deletePublication(index) {
  publications.splice(index, 1); // Remove pelo índice
  localStorage.setItem('publications', JSON.stringify(publications)); // Atualiza o localStorage
  renderPublications(); // Atualiza a tela
}

// Função para editar uma publicação
function editPublication(index) {
  const pub = publications[index];
  document.getElementById('titulo').value = pub.titulo;
  document.getElementById('conteudo').value = pub.conteudo;

  // Remove a publicação atual e espera pelo envio
  deletePublication(index);
}

// Função para alternar o menu lateral (responsividade)
function toggleSidebar() {
  document.querySelector('.sidebar').classList.toggle('open');
}

// Renderiza as publicações iniciais
renderPublications();

document.getElementById('user-form').onsubmit = function(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;

  saveUser(username, email);
  alert('Usuário adicionado com sucesso!');
  document.getElementById('user-form').reset(); // Limpa o formulário
};