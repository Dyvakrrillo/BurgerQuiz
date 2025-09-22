const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const QRCode = require('qrcode');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["https://dyvakrrillo.github.io", "https://burgerquiz.onrender.com", "http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['polling', 'websocket']
});

const PORT = process.env.PORT || 3000;
console.log('🔧 Configuration Railway:');
console.log('PORT:', PORT);
console.log('RAILWAY_PUBLIC_DOMAIN:', process.env.RAILWAY_PUBLIC_DOMAIN);
console.log('RAILWAY_STATIC_URL:', process.env.RAILWAY_STATIC_URL);
const HOST = process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : `http://localhost:${PORT}`;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// État du jeu
let gameState = {
  mayoScore: 0,
  ketchupScore: 0,
  currentSlide: 0,
  players: {
    mayo: [],
    ketchup: []
  },
  buzzerActive: false,
  lastBuzzer: null,
  gameActive: false
};

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'student.html'));
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    port: PORT,
    host: HOST
  });
});

app.get('/socket.io/', (req, res) => {
  res.json({ 
    message: 'Socket.io endpoint available',
    timestamp: new Date().toISOString()
  });
});

app.get('/qr', async (req, res) => {
  try {
    const url = req.protocol + '://' + req.get('host');
    const qrCode = await QRCode.toDataURL(url);
    res.json({ qrCode, url });
  } catch (error) {
    res.status(500).json({ error: 'Erreur génération QR code' });
  }
});

app.get('/game-state', (req, res) => {
  res.json(gameState);
});

// Socket.io
io.on('connection', (socket) => {
  console.log('Nouvelle connexion:', socket.id);

  // Envoyer l'état actuel du jeu
  socket.emit('gameState', gameState);

  // Connexion d'un joueur
  socket.on('playerJoin', (data) => {
    const { name, team } = data;
    const player = { id: socket.id, name, team, connected: true };
    
    // Retirer l'ancien joueur s'il existe
    gameState.players.mayo = gameState.players.mayo.filter(p => p.id !== socket.id);
    gameState.players.ketchup = gameState.players.ketchup.filter(p => p.id !== socket.id);
    
    // Ajouter le nouveau joueur
    if (team === 'mayo') {
      gameState.players.mayo.push(player);
    } else {
      gameState.players.ketchup.push(player);
    }
    
    console.log(`Joueur connecté: ${name} (${team})`);
    
    // Notifier tous les clients
    io.emit('playerJoined', player);
    io.emit('gameState', gameState);
  });

  // Buzzer
  socket.on('buzz', (data) => {
    if (!gameState.buzzerActive) return;
    
    const player = gameState.players.mayo.find(p => p.id === socket.id) || 
                  gameState.players.ketchup.find(p => p.id === socket.id);
    
    if (player && !gameState.lastBuzzer) {
      gameState.lastBuzzer = {
        player: player.name,
        team: player.team,
        timestamp: Date.now()
      };
      
      console.log(`BUZZ! ${player.name} (${player.team})`);
      
      // Notifier tous les clients
      io.emit('buzzerPressed', gameState.lastBuzzer);
      io.emit('gameState', gameState);
    }
  });

  // Réinitialiser le buzzer
  socket.on('resetBuzzer', () => {
    gameState.lastBuzzer = null;
    gameState.buzzerActive = true;
    io.emit('buzzerReset');
    io.emit('gameState', gameState);
  });

  // Mise à jour des scores
  socket.on('updateScore', (data) => {
    const { team, change } = data;
    if (team === 'mayo') {
      gameState.mayoScore = Math.max(0, gameState.mayoScore + change);
    } else if (team === 'ketchup') {
      gameState.ketchupScore = Math.max(0, gameState.ketchupScore + change);
    }
    
    io.emit('gameState', gameState);
  });

  // Changement de slide
  socket.on('changeSlide', (data) => {
    gameState.currentSlide = data.slide;
    io.emit('gameState', gameState);
  });

  // Activer/désactiver le buzzer
  socket.on('toggleBuzzer', (data) => {
    gameState.buzzerActive = data.active;
    if (data.active) {
      gameState.lastBuzzer = null;
    }
    io.emit('gameState', gameState);
  });

  // Déconnexion
  socket.on('disconnect', () => {
    console.log('Déconnexion:', socket.id);
    
    // Retirer le joueur
    gameState.players.mayo = gameState.players.mayo.filter(p => p.id !== socket.id);
    gameState.players.ketchup = gameState.players.ketchup.filter(p => p.id !== socket.id);
    
    io.emit('gameState', gameState);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🍔 Serveur Burger Quiz démarré sur le port ${PORT}`);
  console.log(`📱 Interface étudiante: ${HOST}`);
  console.log(`🌐 URL publique: ${HOST}`);
  console.log(`🔧 Railway Public Domain: ${process.env.RAILWAY_PUBLIC_DOMAIN || 'Non défini'}`);
});
