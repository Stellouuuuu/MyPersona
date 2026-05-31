# Persona — Module Utilisateur & Sécurité

Agrégateur de news personnalisé sans interface graphique. L'utilisateur interagit via un **chatbot N8N** pour s'inscrire, se connecter, gérer son profil et exercer ses droits RGPD.

## Équipe & périmètre

Ce dépôt couvre la partie **Côté Utilisateur & Sécurité** :

- Installation N8N (Docker)
- Inscription via chatbot
- Authentification (login + session)
- Gestion du profil (email, intérêts, horaire)
- Conformité RGPD (export, désinscription, suppression)

## Démarrage rapide

```bash
cp .env.example .env          # modifier le mot de passe admin
docker compose up -d
python3 scripts/migrate_data_tables.py
```

Ouvrir http://localhost:5678 → importer les workflows depuis `workflows/` → publier les sub-workflows puis le workflow principal.

Guide détaillé : [docs/GUIDE_INSTALLATION.md](docs/GUIDE_INSTALLATION.md)
