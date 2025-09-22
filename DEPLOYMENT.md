# 🚀 Déploiement Burger Quiz Multi-joueurs

## Déploiement gratuit sur Railway

### 1. Créer un compte Railway
1. Aller sur [railway.app](https://railway.app)
2. Cliquer sur "Login" → "Login with GitHub"
3. Autoriser Railway à accéder à votre compte GitHub

### 2. Connecter le dépôt GitHub
1. Dans Railway, cliquer sur "New Project"
2. Sélectionner "Deploy from GitHub repo"
3. Choisir votre dépôt "BurgerQuiz"
4. Railway va détecter automatiquement le dossier `server/`

### 3. Configuration automatique
Railway va :
- ✅ Détecter que c'est un projet Node.js
- ✅ Installer les dépendances (`npm install`)
- ✅ Démarrer le serveur (`npm start`)
- ✅ Générer une URL publique gratuite

### 4. Obtenir l'URL publique
1. Une fois déployé, Railway vous donnera une URL comme :
   `https://burger-quiz-production-xxxx.up.railway.app`
2. **Copiez cette URL !**

### 5. Mettre à jour le jeu principal
1. Ouvrir `fonctions.js`
2. Remplacer `http://localhost:3000` par votre URL Railway
3. Commiter et pousser sur GitHub

### 6. Héberger le frontend
**Option A : GitHub Pages (gratuit)**
1. Aller dans Settings → Pages
2. Source : Deploy from a branch
3. Branch : main
4. Folder : / (root)
5. Votre jeu sera accessible sur : `https://dyvakrrillo.github.io/BurgerQuiz/`

**Option B : Netlify (gratuit)**
1. Aller sur [netlify.com](https://netlify.com)
2. "New site from Git" → GitHub
3. Sélectionner votre dépôt
4. Build command : (laisser vide)
5. Publish directory : (laisser vide)
6. Deploy !

### 7. Utilisation en classe
1. **Maître du jeu** : Ouvrir l'URL GitHub Pages/Netlify
2. **Activer** le mode multi-joueurs
3. **Afficher** le QR code aux étudiants
4. **Étudiants** : Scanner le QR code avec leur téléphone
5. **Jouer** ! 🎮

## URLs finales
- **Jeu principal** : `https://dyvakrrillo.github.io/BurgerQuiz/`
- **Serveur multi-joueurs** : `https://burger-quiz-production-xxxx.up.railway.app`
- **Interface étudiante** : `https://burger-quiz-production-xxxx.up.railway.app`

## Coût
- **Railway** : 100% gratuit (500h/mois)
- **GitHub Pages** : 100% gratuit
- **Total** : 0€ ! 🎉

## Support
Si problème, vérifier :
1. Le serveur Railway est-il démarré ?
2. L'URL dans `fonctions.js` est-elle correcte ?
3. Les étudiants sont-ils sur le même réseau WiFi ?
