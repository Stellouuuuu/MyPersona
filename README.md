# Persona — Agrégateur de news personnalisé

**Persona** est un agrégateur de news personnalisé **sans interface produit**. L'utilisateur interagit uniquement via un **chatbot N8N** et reçoit une **newsletter HTML** par email.

> Pas de site web « classique » : le point d'entrée est le chat. Un portail démo (`public/`) sert uniquement à exposer le chatbot en démo ou en ligne — ce n'est pas l'application finale.

---

## Table des matières

1. [Ce qui est demandé (sujet)](#ce-qui-est-demandé-sujet)
2. [Ce que nous avons livré](#ce-que-nous-avons-livré)
3. [Fonctionnalités bonus](#fonctionnalités-bonus)
4. [Architecture rapide](#architecture-rapide)
5. [Installation locale (étape par étape)](#installation-locale-étape-par-étape)
6. [Tester en local](#tester-en-local)
7. [Accès en ligne (démo / production)](#accès-en-ligne-démo--production)
8. [Configuration (.env)](#configuration-env)
9. [Workflows](#workflows)
10. [Documentation complémentaire](#documentation-complémentaire)

---

## Ce qui est demandé (sujet)

Le module **Utilisateur & Sécurité** impose :

| Exigence | Description |
|----------|-------------|
| **Point d'entrée unique** | Chatbot N8N (Chat Trigger) — pas d'UI produit |
| **Inscription** | Parcours guidé + **consentement RGPD explicite** avant stockage |
| **Authentification** | Connexion, session token, déconnexion |
| **Profil** | Consultation et modification (email, intérêts, horaire newsletter) |
| **RGPD** | Export des données, désinscription newsletter, suppression du compte |
| **Sécurité** | Mots de passe hashés, sessions, accès filtré par utilisateur |
| **Modularité** | Sub-workflows réutilisables (Register, Login, Profile, GDPR…) |
| **Persistance** | Data Tables N8N (`users`, etc.) |

L'équipe **newsletter** peut s'appuyer sur `Persona - Sub Validate Session` pour vérifier qu'un utilisateur est authentifié avant d'envoyer du contenu.

---

## Ce que nous avons livré

### Module Utilisateur & Sécurité

- Chatbot conversationnel avec machine à états (inscription, connexion, profil, RGPD)
- 6 sub-workflows : Register, Login, Logout, Profile, GDPR, Validate Session
- Hash SHA-256 + sel, tokens de session UUID avec expiration
- Consentement RGPD obligatoire à l'inscription (`oui` / `non`)
- Commandes : `inscription`, `connexion`, `profil`, `rgpd`, `déconnexion`, `aide`, `annuler`

### Infrastructure

- **Docker Compose** pour N8N
- Workflows versionnés dans `workflows/*.json`
- Script de déploiement `scripts/n8n_deploy_fix.py` (sync DB, publication, credentials)
- Portail démo statique + frontend React (`frontend/`) pour la keynote
- Déploiement Vercel possible (`api/chat.js` → proxy vers N8N)

---

## Fonctionnalités bonus

| Bonus | Commande / déclencheur | Workflow |
|-------|------------------------|----------|
| **Aperçu newsletter** | `aperçu`, `preview`, `newsletter` (connecté) | Sub Send Newsletter |
| **Newsletter HTML** | RSS multi-sources + curation IA | Sub Send Newsletter |
| **« Pourquoi cette actu ? »** | Sous chaque article dans l'email | Sub Send Newsletter |
| **Liens RGPD signés (HMAC)** | Footer de l'email (72 h) | GDPR Webhook |
| **Feedback par email** | Répondre à la newsletter | Email Feedback |
| **Planification horaire** | Automatique chaque heure | Newsletter Schedule |
| **Journal d'audit** | Toutes actions sensibles | Sub Audit Log |
| **Portail démo** | Page web légère autour du chat | `public/index.html` |

Détail : [docs/GUIDE_BONUS.md](docs/GUIDE_BONUS.md)

---

## Architecture rapide

```
Utilisateur
    │
    ▼
Chat Trigger (N8N)  ──►  Process Message (machine à états)
    │                           │
    │                           ▼
    │                    Route Action
    │                     /    |    \
    ▼                    ▼     ▼     ▼
Sub Register      Sub Login   Sub Profile   Sub GDPR …
    │                    │         │            │
    └────────────────────┴─────────┴────────────┘
                              │
                              ▼
                    Data Table `users`
                              │
                    (bonus) Sub Send Newsletter ──► Email HTML
```

---

## Installation locale (étape par étape)

### Prérequis

- [Docker](https://docs.docker.com/get-docker/) et Docker Compose
- [Git](https://git-scm.com/)
- Python 3 (scripts de migration / déploiement)
- *(Recommandé pour l'IA locale)* [Ollama](https://ollama.com/) avec un modèle (`mistral`, `llama3.2`…)
- *(Pour l'email)* Compte Gmail + [mot de passe d'application](https://myaccount.google.com/apppasswords)

### 1. Récupérer le dépôt

```bash
git clone <URL_DU_REPO> G-AIA-410-COT-4-1-persona-22
cd G-AIA-410-COT-4-1-persona-22
```

### 2. Configurer l'environnement

```bash
cp .env.example .env
```

Éditer `.env` — minimum à renseigner :

```env
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=changeme123

PERSONA_GDPR_SECRET=votre-secret-long-et-aleatoire-min-32-chars
PERSONA_PUBLIC_URL=http://localhost:5678

GMAIL_ADDRESS=votre@gmail.com
GMAIL_APP_PASSWORD=mot_de_passe_application_sans_espaces

OLLAMA_HOST=http://host-gateway:11434
OLLAMA_MODEL=mistral:latest
# ou GEMINI_API_KEY=... si vous préférez Gemini
```

### 3. Démarrer N8N

```bash
docker compose up -d
```

Interface N8N : **http://localhost:5678**  
Identifiants : ceux de `N8N_BASIC_AUTH_USER` / `N8N_BASIC_AUTH_PASSWORD`.

### 4. Créer les Data Tables (première fois)

Dans N8N : **Settings → Data tables**

**Table `users`** — colonnes principales :

`username`, `password_hash`, `salt`, `email`, `interests`, `schedule_time`, `active`, `session_token`, `session_expires_at`, `gdpr_consent_at`, `created_at`

Colonnes **bonus** (texte, optionnelles) : `blocked_sources`, `blocked_topics`, `preferences`, `newsletter_style`

**Table `audit_log`** — colonnes : `timestamp`, `user_id`, `username`, `action`, `details`, `ip_or_source`

Afficher le schéma complet :

```bash
python3 scripts/migrate_data_tables.py
```

### 5. Importer les workflows

**Option A — Première installation (interface N8N)**

1. **Workflows → Add workflow → Import from file**
2. Importer dans cet ordre les fichiers de `workflows/` :
   - Tous les `persona_-_sub_*.json`
   - `persona_-_utilisateur_et_securite.json`
   - `persona_-_gdpr_webhook.json`, `persona_-_newsletter_schedule.json`, `persona_-_email_feedback.json`
3. Sur chaque nœud **Data Table**, resélectionner les tables `users` / `audit_log`
4. **Publier** chaque sub-workflow, puis le workflow principal

**Option B — Instance déjà configurée (recommandé)**

Si le dossier `n8n_data/` existe déjà (workflows importés une première fois) :

```bash
docker compose stop n8n
python3 scripts/n8n_deploy_fix.py
docker compose start n8n
```

Ce script synchronise les JSON du repo, corrige les références, publie les versions actives et réinitialise le mot de passe test `stella` → `Princesse1`.

### 6. Configurer les credentials N8N

Dans N8N : **Credentials → Add credential**

| Type | Usage | Paramètres Gmail typiques |
|------|-------|---------------------------|
| **SMTP** | Envoi newsletter | `smtp.gmail.com`, port **465**, SSL ON, email + mot de passe app |
| **IMAP** | Feedback email (bonus) | `imap.gmail.com`, port **993**, SSL ON, mêmes identifiants |

Relier le credential SMTP au nœud **Send Email** du workflow `Persona - Sub Send Newsletter`.

> Dans les nœuds **Send Email**, mettre l'adresse expéditeur **en dur** (`startetbrille2@gmail.com` ou la vôtre) si `$env.GMAIL_ADDRESS` est bloqué dans l'UI N8N.

### 7. *(Optionnel)* Ollama pour l'IA locale

```bash
ollama pull mistral:latest
ollama serve   # si pas déjà lancé
```

N8N accède à Ollama via `host-gateway:11434` (configuré dans `docker-compose.yml`).

### 8. Lancer le portail démo (optionnel)

```bash
docker compose --profile demo up -d
```

Portail : **http://localhost:8080**  
Le proxy `/api/chat` redirige vers le webhook N8N — pas besoin de copier l'URL à la main.

**Alternative — frontend React en dev :**

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

---

## Tester en local

### Accès au chatbot

| Méthode | URL |
|---------|-----|
| **Chat intégré N8N** | http://localhost:5678 → workflow `Persona - Utilisateur & Securite` → nœud *When chat message received* → **Open Chat** |
| **Webhook direct** | `http://localhost:5678/webhook/21821179-6560-462f-a678-8daf96d079ae/chat` |
| **Portail démo** | http://localhost:8080 |
| **Frontend dev** | http://localhost:5173 (après `npm run dev` dans `frontend/`) |

### Scénario de test rapide

```
connexion
stella
Princesse1
aperçu
```

Résultat attendu : message confirmant l'envoi de la newsletter à l'email du profil (~30–60 s avec Ollama).

### Inscription complète

```
inscription
monpseudo
MonMotDePasse1
MonMotDePasse1
email@exemple.com
IA, sport
08:00
oui
```

Règles mot de passe : 8 caractères minimum, au moins une lettre et un chiffre.

### Commandes utiles

| Commande | Action |
|----------|--------|
| `inscription` | Créer un compte |
| `connexion` | Se connecter |
| `profil` | Voir / modifier le profil |
| `aperçu` | Recevoir la newsletter maintenant |
| `rgpd` | Export, désinscription, suppression |
| `déconnexion` | Fermer la session |
| `aide` | Aide |
| `annuler` | Annuler l'action en cours |

Guide détaillé : [docs/GUIDE_UTILISATION.md](docs/GUIDE_UTILISATION.md)

### Vérifier que tout tourne

```bash
docker compose ps
docker compose logs n8n --tail 30
```

Les 12 workflows `Persona - *` doivent être **actifs** dans N8N.

---

## Accès en ligne (démo / production)

Le frontend peut être hébergé sur **Vercel** ; N8N doit rester accessible depuis Internet (VPS, Railway, Render, tunnel **ngrok**, etc.).

### Schéma

```
Navigateur  →  Vercel (public/index.html + api/chat.js)
                    │
                    ▼
              N8N webhook (URL publique)
                    │
                    ▼
              Workflows Persona
```

### Déployer le portail sur Vercel

1. Pousser le repo sur GitHub
2. Importer le projet sur [vercel.com](https://vercel.com)
3. Variables d'environnement Vercel :

| Variable | Exemple |
|----------|---------|
| `N8N_WEBHOOK_URL` | `https://votre-n8n.example.com/webhook/21821179-6560-462f-a678-8daf96d079ae/chat` |
| `N8N_BASIC_AUTH` | *(optionnel)* `base64(user:password)` si N8N est protégé par basic auth |

4. Déployer — Vercel build le frontend et sert `public/`

Le navigateur appelle `/api/chat` ; le proxy Vercel (`api/chat.js`) relaie vers N8N. **L'utilisateur ne voit jamais l'interface N8N.**

### Exposer N8N localement (démo rapide)

```bash
ngrok http 5678
```

Copier l'URL HTTPS ngrok dans `N8N_WEBHOOK_URL` sur Vercel.  
Mettre à jour `PERSONA_PUBLIC_URL` dans `.env` N8N pour les liens RGPD dans les emails.

### Accès en ligne — checklist

- [ ] N8N accessible en HTTPS (webhook chat + webhook `persona-gdpr`)
- [ ] Workflows publiés et actifs
- [ ] Credentials SMTP (et IMAP pour le feedback)
- [ ] `PERSONA_GDPR_SECRET` et `PERSONA_PUBLIC_URL` configurés
- [ ] `N8N_WEBHOOK_URL` renseigné sur Vercel

---

## Configuration (.env)

| Variable | Rôle |
|----------|------|
| `N8N_BASIC_AUTH_USER` / `PASSWORD` | Accès interface N8N |
| `PERSONA_GDPR_SECRET` | Signature HMAC des liens RGPD (email) |
| `PERSONA_PUBLIC_URL` | URL publique de N8N (liens dans les emails) |
| `GMAIL_ADDRESS` / `GMAIL_APP_PASSWORD` | Envoi (et feedback) email |
| `GEMINI_API_KEY` | IA cloud *(prioritaire si renseigné)* |
| `OLLAMA_HOST` / `OLLAMA_MODEL` | IA locale *(fallback)* |
| `N8N_WEBHOOK_URL` | Pour Vercel / proxy en ligne |

Ne jamais commiter `.env` — seul `.env.example` est versionné.

---

## Workflows

| Fichier | Rôle |
|---------|------|
| `persona_-_utilisateur_et_securite.json` | Chatbot principal |
| `persona_-_sub_register.json` | Inscription |
| `persona_-_sub_login.json` | Connexion |
| `persona_-_sub_logout.json` | Déconnexion |
| `persona_-_sub_profile.json` | Profil |
| `persona_-_sub_gdpr.json` | RGPD (chatbot) |
| `persona_-_sub_validate_session.json` | Validation session *(équipe newsletter)* |
| `persona_-_sub_send_newsletter.json` | **Bonus** — génération + envoi HTML |
| `persona_-_newsletter_schedule.json` | **Bonus** — envoi horaire |
| `persona_-_gdpr_webhook.json` | **Bonus** — liens signés one-click |
| `persona_-_email_feedback.json` | **Bonus** — apprentissage par email |
| `persona_-_sub_audit_log.json` | **Bonus** — journal d'audit |

---

## Dépannage

| Problème | Solution |
|----------|----------|
| `workflow not published` | Publier les sub-workflows **avant** le principal, ou lancer `python3 scripts/n8n_deploy_fix.py` |
| `connexion` ne répond pas | Redéployer avec `n8n_deploy_fix.py` (sync `activeVersionId`) |
| `process is not defined` | Workflows à jour dans le repo (`$env` au lieu de `process.env`) + redéployer |
| Email non reçu | Vérifier credential SMTP, mot de passe app Gmail, expéditeur en dur dans Send Email |
| IA indisponible | Lancer Ollama ou renseigner `GEMINI_API_KEY` |
| Email Feedback inactif | Configurer credential IMAP dans N8N |
| Mot de passe refusé | Min. 8 car., lettre + chiffre (ex. `Princesse1`) |

---

## Documentation complémentaire

| Document | Contenu |
|----------|---------|
| [docs/GUIDE_INSTALLATION.md](docs/GUIDE_INSTALLATION.md) | Installation détaillée |
| [docs/GUIDE_UTILISATION.md](docs/GUIDE_UTILISATION.md) | Commandes chatbot |
| [docs/GUIDE_BONUS.md](docs/GUIDE_BONUS.md) | Fonctionnalités bonus |
| [docs/GUIDE_DEMO.md](docs/GUIDE_DEMO.md) | Scénario keynote / jury |
| [docs/SECURITE_RGPD.md](docs/SECURITE_RGPD.md) | Sécurité et conformité |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Architecture technique |
| [docs/FICHE_RECAP.md](docs/FICHE_RECAP.md) | Récap une page |

---

## Sécurité

- Mots de passe : SHA-256 + sel unique par utilisateur
- Sessions : token UUID, expiration 24 h
- Liens RGPD : HMAC-SHA256, validité 72 h
- Audit log des actions sensibles (envoi newsletter, RGPD, feedback)

**Avant de partager les JSON exportés** : retirer les IDs de credentials et les clés API.

---

## Équipe & module

Projet **G-AIA-410** — module **Utilisateur & Sécurité** + extensions bonus newsletter / RGPD avancé.
