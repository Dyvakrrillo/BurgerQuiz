class StudentGame {
    constructor() {
        this.socket = null;
        this.playerName = '';
        this.team = '';
        this.connected = false;
        this.gameState = null;
        
        this.initializeElements();
        this.setupEventListeners();
        this.connectToServer();
    }

    initializeElements() {
        // Écrans
        this.loginScreen = document.getElementById('login-screen');
        this.gameScreen = document.getElementById('game-screen');
        this.disconnectedScreen = document.getElementById('disconnected-screen');
        
        // Éléments de connexion
        this.playerNameInput = document.getElementById('playerName');
        this.teamButtons = document.querySelectorAll('.team-btn');
        this.joinButton = document.getElementById('joinGame');
        
        // Éléments de jeu
        this.playerNameDisplay = document.getElementById('playerNameDisplay');
        this.teamDisplay = document.getElementById('teamDisplay');
        this.connectionStatus = document.getElementById('connectionStatus');
        this.mayoScore = document.getElementById('mayoScore');
        this.ketchupScore = document.getElementById('ketchupScore');
        this.buzzerStatus = document.getElementById('buzzerStatus');
        this.buzzerBtn = document.getElementById('buzzerBtn');
        this.currentSlide = document.getElementById('currentSlide');
        this.lastBuzzer = document.getElementById('lastBuzzer');
        this.reconnectBtn = document.getElementById('reconnectBtn');
    }

    setupEventListeners() {
        // Connexion
        this.playerNameInput.addEventListener('input', () => this.updateJoinButton());
        this.teamButtons.forEach(btn => {
            btn.addEventListener('click', () => this.selectTeam(btn));
        });
        this.joinButton.addEventListener('click', () => this.joinGame());
        
        // Buzzer
        this.buzzerBtn.addEventListener('click', () => this.buzz());
        
        // Reconnexion
        this.reconnectBtn.addEventListener('click', () => this.reconnect());
    }

    connectToServer() {
        this.socket = io();
        
        this.socket.on('connect', () => {
            console.log('Connecté au serveur');
            this.connected = true;
            this.updateConnectionStatus();
        });

        this.socket.on('disconnect', () => {
            console.log('Déconnecté du serveur');
            this.connected = false;
            this.showScreen('disconnected');
            this.updateConnectionStatus();
        });

        this.socket.on('gameState', (state) => {
            this.gameState = state;
            this.updateGameDisplay();
        });

        this.socket.on('buzzerPressed', (buzzerData) => {
            this.showBuzzerResult(buzzerData);
        });

        this.socket.on('buzzerReset', () => {
            this.resetBuzzer();
        });

        this.socket.on('playerJoined', (player) => {
            console.log(`Joueur rejoint: ${player.name} (${player.team})`);
        });
    }

    selectTeam(button) {
        // Désélectionner tous les boutons
        this.teamButtons.forEach(btn => btn.classList.remove('selected'));
        
        // Sélectionner le bouton cliqué
        button.classList.add('selected');
        this.team = button.dataset.team;
        
        this.updateJoinButton();
    }

    updateJoinButton() {
        const nameValid = this.playerNameInput.value.trim().length > 0;
        const teamSelected = this.team !== '';
        
        this.joinButton.disabled = !(nameValid && teamSelected);
    }

    joinGame() {
        if (!this.connected) {
            alert('Pas de connexion au serveur');
            return;
        }

        this.playerName = this.playerNameInput.value.trim();
        
        if (this.playerName.length === 0 || this.team === '') {
            alert('Veuillez entrer votre nom et sélectionner une équipe');
            return;
        }

        // Envoyer les données au serveur
        this.socket.emit('playerJoin', {
            name: this.playerName,
            team: this.team
        });

        // Passer à l'écran de jeu
        this.showScreen('game');
        this.updatePlayerInfo();
    }

    updatePlayerInfo() {
        this.playerNameDisplay.textContent = this.playerName;
        this.teamDisplay.textContent = this.team.toUpperCase();
        this.teamDisplay.className = `team-badge ${this.team}`;
    }

    updateGameDisplay() {
        if (!this.gameState) return;

        // Mettre à jour les scores
        this.mayoScore.textContent = this.formatScore(this.gameState.mayoScore);
        this.ketchupScore.textContent = this.formatScore(this.gameState.ketchupScore);

        // Mettre à jour la diapositive
        this.currentSlide.textContent = `Diapositive ${this.gameState.currentSlide + 1}`;

        // Mettre à jour le buzzer
        this.updateBuzzerState();
    }

    updateBuzzerState() {
        if (!this.gameState) return;

        if (!this.gameState.buzzerActive) {
            this.buzzerBtn.disabled = true;
            this.buzzerStatus.textContent = 'Buzzer désactivé';
            this.buzzerBtn.classList.remove('pulse');
        } else if (this.gameState.lastBuzzer) {
            this.buzzerBtn.disabled = true;
            this.buzzerStatus.textContent = 'Buzzer déjà utilisé !';
            this.buzzerBtn.classList.remove('pulse');
        } else {
            this.buzzerBtn.disabled = false;
            this.buzzerStatus.textContent = 'Prêt à buzzer !';
            this.buzzerBtn.classList.add('pulse');
        }
    }

    buzz() {
        if (!this.connected || !this.gameState || !this.gameState.buzzerActive) {
            return;
        }

        if (this.gameState.lastBuzzer) {
            return;
        }

        // Envoyer le buzz au serveur
        this.socket.emit('buzz', {
            player: this.playerName,
            team: this.team
        });

        // Feedback visuel immédiat
        this.buzzerBtn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        this.buzzerBtn.textContent = 'BUZZÉ !';
        
        setTimeout(() => {
            this.buzzerBtn.style.background = 'linear-gradient(135deg, #ff6b35, #f7931e)';
            this.buzzerBtn.innerHTML = '<span class="buzzer-text">MIAM</span><span class="buzzer-subtitle">Appuyez pour buzzer !</span>';
        }, 1000);
    }

    showBuzzerResult(buzzerData) {
        const isMyBuzz = buzzerData.player === this.playerName;
        const isMyTeam = buzzerData.team === this.team;
        
        let message = '';
        if (isMyBuzz) {
            message = `🎉 Vous avez buzzé en premier !`;
        } else if (isMyTeam) {
            message = `👥 ${buzzerData.player} de votre équipe a buzzé !`;
        } else {
            message = `⚡ ${buzzerData.player} (${buzzerData.team.toUpperCase()}) a buzzé !`;
        }

        this.lastBuzzer.innerHTML = `<strong>${message}</strong>`;
    }

    resetBuzzer() {
        this.lastBuzzer.innerHTML = '';
        this.updateBuzzerState();
    }

    updateConnectionStatus() {
        if (this.connected) {
            this.connectionStatus.textContent = '🟢 Connecté';
            this.connectionStatus.style.color = '#4CAF50';
        } else {
            this.connectionStatus.textContent = '🔴 Déconnecté';
            this.connectionStatus.style.color = '#ff4444';
        }
    }

    showScreen(screenName) {
        // Cacher tous les écrans
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Afficher l'écran demandé
        document.getElementById(`${screenName}-screen`).classList.add('active');
    }

    formatScore(score) {
        return score < 10 ? `0${score}` : score.toString();
    }

    reconnect() {
        this.connectToServer();
        this.showScreen('login');
    }
}

// Démarrer l'application quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    new StudentGame();
});
