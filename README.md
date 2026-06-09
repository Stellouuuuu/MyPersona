# Persona — AI News Aggregator

Agrégateur de news personnalisé **sans interface produit**. L'utilisateur interagit via un **chatbot N8N** et reçoit une **newsletter HTML** par email.

## Fonctionnalités bonus (waouh jury)

| Feature | Description |
|---------|-------------|
| **Preview instantané** | Commande `aperçu` dans le chatbot → newsletter immédiate |
| **Newsletter HTML premium** | Multi-sources RSS, déduplication, filtrage IA |
| **« Pourquoi cette actu ? »** | Explication de pertinence sous chaque article |
| **Liens RGPD signés (HMAC)** | Désinscription / export / suppression en 1 clic depuis l'email |
| **Feedback par email** | Répondre à la newsletter pour ajuster les préférences |
| **Journal d'audit RGPD** | Traçabilité de toutes les actions sensibles |
| **Planification horaire** | Envoi automatique selon `schedule_time` de chaque user |
| **Portail démo** | `public/index.html` — expose le chatbot sans UI produit |

## Démarrage rapide

```bash
cp .env.example .env          # configurer secrets et email
docker compose up -d
python3 scripts/migrate_data_tables.py   # affiche le schéma Data Tables
python3 -m http.server 8080 --directory public   # portail démo (optionnel)
```

Le portail démo est une interface type application (sidebar violette, chat 3 colonnes) avec animations **Framer Motion**. Sources dans `frontend/` ; build : `cd frontend && npm run build`.

### Déployer sur Vercel

1. Pousser le repo sur GitHub
2. Importer le projet sur [vercel.com](https://vercel.com)
3. Ajouter la variable d'environnement :
   - `N8N_WEBHOOK_URL` = URL publique du webhook chat N8N (ex. `https://votre-n8n.com/webhook/xxx/chat`)
4. N8N doit être accessible depuis Internet (tunnel ngrok, Railway, VPS…)

Le frontend appelle `/api/chat` (proxy Vercel → N8N) — pas de redirection vers l'interface N8N.

Ouvrir http://localhost:5678 → importer les workflows depuis `workflows/` → publier les sub-workflows puis les workflows principaux.

## Workflows

| Workflow | Rôle |
|----------|------|
| `Persona - Utilisateur & Securite` | Chatbot principal (inscription, auth, profil, RGPD, **aperçu**) |
| `Persona - Sub Register/Login/Logout/Profile/GDPR` | Modules sécurité |
| `Persona - Sub Validate Session` | Validation session (équipe newsletter) |
| `Persona - Sub Send Newsletter` | **Bonus** — génération HTML + envoi email |
| `Persona - Newsletter Schedule` | **Bonus** — envoi horaire automatique |
| `Persona - GDPR Webhook` | **Bonus** — liens signés one-click |
| `Persona - Email Feedback` | **Bonus** — apprentissage par réponse email |
| `Persona - Sub Audit Log` | **Bonus** — journal d'audit |

## Configuration (.env)

```bash
PERSONA_GDPR_SECRET=changez-moi-en-production-min-32-chars
PERSONA_PUBLIC_URL=http://localhost:5678
GEMINI_API_KEY=                    # optionnel (sinon Ollama local)
GMAIL_ADDRESS=
GMAIL_APP_PASSWORD=
OLLAMA_MODEL=llama3.2
```

## Data Tables N8N

Table `users` — ajouter colonnes bonus : `blocked_sources`, `blocked_topics`, `preferences`, `newsletter_style`

Table `audit_log` — créer avec : `timestamp`, `user_id`, `username`, `action`, `details`, `ip_or_source`

Voir `python3 scripts/migrate_data_tables.py` pour le détail.

## Démo keynote

1. Ouvrir `public/index.html?chat=URL_DU_CHAT_N8N`
2. `inscription` → profil avec intérêts
3. `aperçu` → email HTML en direct
4. Montrer « Pourquoi cette actu ? » + footer RGPD
5. Répondre à l'email → feedback
6. Cliquer lien désinscription → page HTML signée

## Sécurité

- Mots de passe hashés (SHA-256 + sel)
- Sessions token UUID avec expiration
- Liens RGPD : HMAC-SHA256, expiration 72h
- Audit log de toutes les actions RGPD et envois newsletter

**Avant de partager les JSON** : retirer credential IDs et clés API des workflows exportés.
