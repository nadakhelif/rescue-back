# Utiliser une image de base Node.js avec TypeScript
FROM node:18-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier le package.json et le package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier les fichiers de l'application
COPY . .

# Construire l'application TypeScript
RUN npm run build

# Commande pour démarrer le serveur Nest.js
CMD ["npm", "run", "start"]
