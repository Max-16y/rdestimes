const express = require('express');
const app = express();
const port = 3000;

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
})
