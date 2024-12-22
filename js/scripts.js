document.addEventListener('DOMContentLoaded', () => {
  // Animações de zoom nas imagens da galeria
  const galeriaImages = document.querySelectorAll('.projetos img');
  galeriaImages.forEach(image => {
    image.addEventListener('mouseover', () => image.style.transform = "scale(1.1)");
    image.addEventListener('mouseout', () => image.style.transform = "scale(1)");
  });

  // Mostrar ou esconder o botão "Voltar ao topo"
  const backToTop = document.getElementById("backToTop");
  window.addEventListener('scroll', () => {
    backToTop.style.display = window.scrollY > 100 ? "block" : "none";
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Modo noturno
  const toggleButton = document.getElementById('toggle-dark-mode');
  const body = document.body;

  toggleButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    localStorage.setItem('dark-mode', body.classList.contains('dark-mode') ? 'enabled' : 'disabled');
  });

  if (localStorage.getItem('dark-mode') === 'enabled') {
    body.classList.add('dark-mode');
  }

  // Carregar e salvar comentários
  const formComentario = document.getElementById('form-comentario');
  const comentariosDiv = document.getElementById('comentarios');

  const salvarComentarios = () => localStorage.setItem('comentarios', comentariosDiv.innerHTML);
  const carregarComentarios = () => {
    const comentariosSalvos = localStorage.getItem('comentarios');
    if (comentariosSalvos) comentariosDiv.innerHTML = comentariosSalvos;
  };

  formComentario.addEventListener('submit', (event) => {
    event.preventDefault();
    const nome = document.getElementById('nome').value.trim();
    const comentario = document.getElementById('comentario').value.trim();

    if (!nome || !comentario) {
      alert("Nome e comentário são obrigatórios.");
      return;
    }

    const novoComentario = document.createElement('div');
    novoComentario.classList.add('comentario');
    novoComentario.innerHTML = `<strong>${nome}</strong><p>${comentario}</p>`;
    comentariosDiv.appendChild(novoComentario);
    salvarComentarios();
    formComentario.reset();
  });

  carregarComentarios();
});
