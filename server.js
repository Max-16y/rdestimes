const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');
const session = require('express-session');
const pathImages = 'public/images';

const app = express();
const PORT = process.env.PORT || 3000;

// Garantir que a pasta de imagens existe
if (!fs.existsSync(pathImages)) {
  fs.mkdirSync(pathImages, { recursive: true });
}

// Configuração para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para processar o corpo da requisição (formulário)
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração da sessão para controle de autenticação
app.use(session({
  secret: 'painelAdmin',
  resave: false,
  saveUninitialized: true
}));

// Carregar os usuários (arquivo JSON)
const users = JSON.parse(fs.readFileSync('users.json'));

// Carregar as publicações
let publicacoes = [];
fs.readFile('publicacoes.json', 'utf8', (err, data) => {
  if (!err && data) {
    publicacoes = JSON.parse(data);
  }
});

// Rota para a página de login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Rota para processar o login
app.post('/login', (req, res) => {
  const { usuario, senha } = req.body;

  // Verificar se o usuário existe e se a senha está correta
  const user = users.find(u => u.usuario === usuario && u.senha === senha);

  if (user) {
    // Usuário autenticado
    req.session.authenticated = true;
    res.redirect('/dashboard');
  } else {
    // Credenciais incorretas
    res.send('<h2>Credenciais incorretas</h2><a href="/login">Tente novamente</a>');
  }
});

// Rota para o Dashboard (protegido)
app.get('/dashboard', (req, res) => {
  if (!req.session.authenticated) {
    return res.redirect('/login');
  }

  res.sendFile(path.join(__dirname, 'public', 'inicio.html'));
});

// Rota para logout
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/dashboard');
    }
    res.redirect('/login');
  });
});

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Rota para criar uma nova publicação (salvamento de dados)
app.post('/criar-publicacao', upload.single('imagem'), (req, res) => {
  const { titulo, corpo, url } = req.body;

  // Se houver imagem, definir a URL da imagem
  const imagemUrl = req.file ? `/images/${req.file.filename}` : url;

  const novaPublicacao = {
    titulo,
    corpo,
    imagemUrl,
    data: new Date().toISOString()
  };

  // Adicionar a nova publicação ao array
  publicacoes.push(novaPublicacao);

  // Salvar as publicações no arquivo JSON
  fs.writeFile('publicacoes.json', JSON.stringify(publicacoes, null, 2), (err) => {
    if (err) {
      console.log('Erro ao salvar publicações:', err);
      res.status(500).send('Erro ao salvar a publicação.');
    } else {
      res.redirect('/projetos'); // Redireciona para a página de projetos
    }
  });
});

// API para buscar publicações
app.get('/api/publicacoes', (req, res) => {
  fs.readFile('publicacoes.json', 'utf8', (err, data) => {
    if (err) {
      console.log('Erro ao carregar publicações:', err);
      return res.status(500).json({ error: 'Erro ao carregar publicações.' });
    }
    res.json(JSON.parse(data || '[]'));
  });
});

// Rota para a página de projetos
app.get('/projetos', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'projetos.html'));
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});