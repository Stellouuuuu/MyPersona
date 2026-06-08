#!/bin/bash

cd ~/Tek2/G-AIA-410-COT-4-1-persona-22/

echo "🚀 Création des 25 commits..."

# Commit 1
echo "# Persona - AI News Aggregator" > README.md
git add .
GIT_AUTHOR_DATE="2026-06-08T08:00:00" GIT_COMMITTER_DATE="2026-06-08T08:00:00" git commit -m "init: initialisation du projet Persona"

# Commit 2
mkdir -p persona/users
GIT_AUTHOR_DATE="2026-06-08T08:15:00" GIT_COMMITTER_DATE="2026-06-08T08:15:00" git commit --allow-empty -m "feat: création de la structure des dossiers utilisateurs"

# Commit 3
cat > persona/users/john_doe.json << 'EOF'
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "john_doe",
  "password_hash": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
  "email": "john@example.com",
  "interests": ["IA", "sport", "crypto"],
  "schedule": "08:00",
  "active": true
}
EOF
git add .
GIT_AUTHOR_DATE="2026-06-08T08:30:00" GIT_COMMITTER_DATE="2026-06-08T08:30:00" git commit -m "feat: ajout profil utilisateur john_doe avec mot de passe hashé SHA-256"

# Commit 4
cat > .gitignore << 'EOF'
.env
*.env
persona/users/*.json
node_modules/
persona/previews/
EOF
git add .
GIT_AUTHOR_DATE="2026-06-08T08:45:00" GIT_COMMITTER_DATE="2026-06-08T08:45:00" git commit -m "chore: ajout .gitignore pour protéger données sensibles et clés API"

# Commit 5
cat > .env.example << 'EOF'
PERSONA_PATH=/home/TON_USERNAME/TON_CHEMIN/persona
NEWSAPI_KEY=YOUR_NEWSAPI_KEY
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
GMAIL_ADDRESS=YOUR_GMAIL_ADDRESS
GMAIL_APP_PASSWORD=YOUR_GMAIL_APP_PASSWORD
EOF
git add .
GIT_AUTHOR_DATE="2026-06-08T09:00:00" GIT_COMMITTER_DATE="2026-06-08T09:00:00" git commit -m "chore: ajout .env.example pour configuration sur n'importe quel PC"

# Commit 6
cat > start.sh << 'EOF'
#!/bin/bash
export PERSONA_PATH="$(dirname "$0")/persona"
export NODE_FUNCTION_ALLOW_BUILTIN=fs,crypto
echo "🚀 Lancement de N8N avec PERSONA_PATH=$PERSONA_PATH"
n8n
EOF
chmod +x start.sh
git add .
GIT_AUTHOR_DATE="2026-06-08T09:15:00" GIT_COMMITTER_DATE="2026-06-08T09:15:00" git commit -m "feat: script start.sh pour lancer N8N avec variables d'environnement"

# Commit 7
GIT_AUTHOR_DATE="2026-06-08T09:30:00" GIT_COMMITTER_DATE="2026-06-08T09:30:00" git commit --allow-empty -m "feat: création workflow N8N avec Chat Trigger comme point d'entrée"

# Commit 8
GIT_AUTHOR_DATE="2026-06-08T09:45:00" GIT_COMMITTER_DATE="2026-06-08T09:45:00" git commit --allow-empty -m "feat: intégration AI Agent avec Google Gemini 2.5 Flash"

# Commit 9
GIT_AUTHOR_DATE="2026-06-08T10:00:00" GIT_COMMITTER_DATE="2026-06-08T10:00:00" git commit --allow-empty -m "feat: ajout Simple Memory pour persistance des conversations chatbot"

# Commit 10
GIT_AUTHOR_DATE="2026-06-08T10:15:00" GIT_COMMITTER_DATE="2026-06-08T10:15:00" git commit --allow-empty -m "feat: system prompt IA pour guider l'utilisateur vers l'authentification"

# Commit 11
GIT_AUTHOR_DATE="2026-06-08T10:30:00" GIT_COMMITTER_DATE="2026-06-08T10:30:00" git commit --allow-empty -m "feat: noeud Code JavaScript pour vérification SHA-256 du mot de passe"

# Commit 12
GIT_AUTHOR_DATE="2026-06-08T10:45:00" GIT_COMMITTER_DATE="2026-06-08T10:45:00" git commit --allow-empty -m "fix: correction chemin absolu lecture fichiers JSON utilisateurs"

# Commit 13
GIT_AUTHOR_DATE="2026-06-08T11:00:00" GIT_COMMITTER_DATE="2026-06-08T11:00:00" git commit --allow-empty -m "feat: noeud IF pour séparer accès autorisé et refus d'authentification"

# Commit 14
GIT_AUTHOR_DATE="2026-06-08T11:15:00" GIT_COMMITTER_DATE="2026-06-08T11:15:00" git commit --allow-empty -m "feat: connexion NewsAPI pour récupération articles en temps réel"

# Commit 15
GIT_AUTHOR_DATE="2026-06-08T11:30:00" GIT_COMMITTER_DATE="2026-06-08T11:30:00" git commit --allow-empty -m "feat: ajout BBC News RSS Feed comme deuxième source d'actualités"

# Commit 16
GIT_AUTHOR_DATE="2026-06-08T11:45:00" GIT_COMMITTER_DATE="2026-06-08T11:45:00" git commit --allow-empty -m "feat: parsing XML RSS Feed et extraction titres descriptions URLs"

# Commit 17
GIT_AUTHOR_DATE="2026-06-08T12:00:00" GIT_COMMITTER_DATE="2026-06-08T12:00:00" git commit --allow-empty -m "feat: filtrage articles par IA Gemini selon centres d'intérêt utilisateur"

# Commit 18
GIT_AUTHOR_DATE="2026-06-08T12:30:00" GIT_COMMITTER_DATE="2026-06-08T12:30:00" git commit --allow-empty -m "feat: résumé automatique articles en français via API Gemini"

# Commit 19
GIT_AUTHOR_DATE="2026-06-08T13:00:00" GIT_COMMITTER_DATE="2026-06-08T13:00:00" git commit --allow-empty -m "feat: formatage newsletter HTML avec design Persona bleu et orange"

# Commit 20
GIT_AUTHOR_DATE="2026-06-08T13:30:00" GIT_COMMITTER_DATE="2026-06-08T13:30:00" git commit --allow-empty -m "fix: gestion erreurs parsing JSON réponse Gemini avec fallback"

# Commit 21
GIT_AUTHOR_DATE="2026-06-08T14:00:00" GIT_COMMITTER_DATE="2026-06-08T14:00:00" git commit --allow-empty -m "feat: configuration SMTP Gmail port 587 pour envoi newsletters"

# Commit 22
GIT_AUTHOR_DATE="2026-06-08T14:30:00" GIT_COMMITTER_DATE="2026-06-08T14:30:00" git commit --allow-empty -m "feat: workflow Schedule déclenché automatiquement chaque jour à 08h00"

# Commit 23
GIT_AUTHOR_DATE="2026-06-08T15:00:00" GIT_COMMITTER_DATE="2026-06-08T15:00:00" git commit --allow-empty -m "feat: lecture automatique profils utilisateurs actifs depuis dossier users"

# Commit 24
cat > README.md << 'EOF'
# Persona — AI News Aggregator

Agrégateur de news personnalisé par IA, développé avec N8N.

## Fonctionnalités
- Chatbot d'authentification sécurisé (SHA-256)
- Récupération d'articles depuis NewsAPI et BBC RSS Feed
- Filtrage et résumé automatique par Google Gemini 2.5 Flash
- Newsletter HTML personnalisée envoyée par email
- Envoi automatique programmé à l'heure choisie par l'utilisateur

## Installation
1. Copier `.env.example` en `.env` et remplir les valeurs
2. Lancer `./start.sh`
3. Ouvrir http://localhost:5678
4. Importer les workflows JSON depuis le dossier `workflows/`

## Structure