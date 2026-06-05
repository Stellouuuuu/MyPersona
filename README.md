# Persona — Module Utilisateur & Sécurité

Agrégateur de news personnalisé sans interface graphique. L'utilisateur interagit via un **chatbot N8N** pour s'inscrire, se connecter, gérer son profil et exercer ses droits RGPD.

## Équipe & périmètre

Ce dépôt couvre la partie **Côté Utilisateur & Sécurité** :

- Installation N8N (Docker)
- Inscription via chatbot
- Authentification (login + session)
- Gestion du profil (email, intérêts, horaire)
- Validation de session avant modification profil
- Conformité RGPD (export, désinscription, suppression)

## Démarrage rapide

```bash
cp .env.example .env          # modifier le mot de passe admin
docker compose up -d
python3 scripts/migrate_data_tables.py
```

Ouvrir http://localhost:5678 → importer les workflows depuis `workflows/` → publier les sub-workflows puis le workflow principal.

Guide détaillé : [docs/GUIDE_INSTALLATION.md](docs/GUIDE_INSTALLATION.md)

## Workflows

| Workflow | Rôle |
|----------|------|
| `Persona - Utilisateur & Securite` | Chatbot principal (point d'entrée) |
| `Persona - Sub Register` | Inscription + hash mot de passe |
| `Persona - Sub Login` | Connexion |
| `Persona - Sub Logout` | Déconnexion |
| `Persona - Sub Profile` | Voir / modifier profil |
| `Persona - Sub GDPR` | Export, désinscription, suppression |
| `Persona - Sub Validate Session` | Validation session (équipe newsletter) |

## Documentation

Index complet : [docs/README.md](docs/README.md)

| Document | Contenu |
|----------|---------|
| [EXPLICATIONS.md](docs/EXPLICATIONS.md) | Explications pédagogiques (pourquoi / comment) |
| [KEYNOTE.md](docs/KEYNOTE.md) | Script de présentation (2–3 min) |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Architecture technique |
| [SECURITE_RGPD.md](docs/SECURITE_RGPD.md) | Sécurité & conformité RGPD |
| [GUIDE_INSTALLATION.md](docs/GUIDE_INSTALLATION.md) | Installation pas à pas |
| [GUIDE_UTILISATION.md](docs/GUIDE_UTILISATION.md) | Commandes chatbot |
| [GUIDE_DEMO.md](docs/GUIDE_DEMO.md) | Scénario de démonstration jury |
| [GUIDE_EQUIPE.md](docs/GUIDE_EQUIPE.md) | Intégration équipe newsletter |
| [FICHE_RECAP.md](docs/FICHE_RECAP.md) | Synthèse 1 page |

## Structure du projet

```
├── docker-compose.yml      # N8N local
├── workflows/              # Workflows exportables (*.json)
├── scripts/                # Setup, migration, correctifs
├── docs/                   # Documentation
└── n8n_data/               # Données N8N (base SQLite, logs)
```

> **Note livrable :** anonymiser les credentials N8N dans les exports JSON avant tout partage externe.

## Livrable

Fichiers JSON exportables dans `workflows/` — **anonymiser** les credentials avant partage (cf. sujet projet).
