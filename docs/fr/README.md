gcal-commander
=================

Une interface en ligne de commande pour les opérations Google Calendar. Gérez vos événements et calendriers Google Calendar directement depuis le terminal.

> 🤖 Ce projet est principalement développé en utilisant [Claude Code](https://claude.ai/code), démontrant les capacités de développement assisté par IA.


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/gcal-commander.svg)](https://npmjs.org/package/gcal-commander)
[![Downloads/week](https://img.shields.io/npm/dw/gcal-commander.svg)](https://npmjs.org/package/gcal-commander)
[![codecov](https://codecov.io/github/buko106/gcal-commander/graph/badge.svg?token=DQUL68E057)](https://codecov.io/github/buko106/gcal-commander)

## Fonctionnalités

- 📅 **Lire les événements Google Calendar** - Lister et afficher des informations détaillées d'événements
- ✏️ **Créer des événements de calendrier** - Ajouter de nouveaux événements avec des options flexibles de temps, participants et lieux
- 📋 **Gérer plusieurs calendriers** - Accédez à tous vos calendriers Google
- 🔐 **Authentification OAuth2 sécurisée** - Configuration unique avec actualisation automatique du token
- 💻 **Sortie conviviale pour le terminal** - Format de tableau propre ou JSON pour les scripts
- 🔇 **Support du mode silencieux** - Utilisez le flag `--quiet` pour supprimer les messages de statut dans les scripts
- 🚀 **Rapide et léger** - Construit avec le framework oclif

## Langues

📖 **README dans d'autres langues :**
- [🇺🇸 English](../../README.md)
- [🇯🇵 日本語 (Japanese)](../ja/README.md)
- [🇪🇸 Español (Spanish)](../es/README.md)
- [🇩🇪 Deutsch (German)](../de/README.md)
- [🇵🇹 Português (Portuguese)](../pt/README.md)

## Installation

```bash
npm install -g gcal-commander
```

## Configuration Initiale

Avant d'utiliser gcal-commander, vous devez configurer l'accès à l'API Google Calendar :

### 1. Configuration de Google Cloud Console

1. Allez à [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez-en un existant
3. Activez l'API Google Calendar :
   - Naviguez vers "APIs & Services" > "Library"
   - Recherchez "Google Calendar API"
   - Cliquez dessus et appuyez sur "Enable"

### 2. Créer les Identifiants OAuth 2.0

1. Allez à "APIs & Services" > "Credentials"
2. Cliquez sur "Create Credentials" > "OAuth client ID"
3. Si demandé, configurez l'écran de consentement OAuth :
   - Choisissez le type d'utilisateur "External"
   - Remplissez les champs requis (Nom de l'application, Email de support utilisateur, Contact développeur)
   - Ajoutez votre email aux utilisateurs de test
4. Pour le type d'application, sélectionnez "Desktop application"
5. Donnez-lui un nom (ex. "gcal-commander")
6. Cliquez sur "Create"
7. Téléchargez le fichier JSON d'identifiants

### 3. Configurer le Fichier d'Identifiants

Placez le fichier d'identifiants téléchargé dans le répertoire de configuration de gcal-commander :

```bash
# Créer le répertoire de configuration
mkdir -p ~/.gcal-commander

# Copier votre fichier d'identifiants téléchargé
cp ~/Downloads/client_secret_*.json ~/.gcal-commander/credentials.json
```

### 4. Authentification au Premier Lancement

Quand vous lancez gcal-commander pour la première fois, il va :

1. Ouvrir votre navigateur par défaut pour l'authentification OAuth Google
2. Vous demander de vous connecter à votre compte Google
3. Demander la permission d'accéder à votre Google Calendar
4. Sauvegarder le token d'authentification automatiquement

```bash
# Premier lancement - ceci déclenchera le flux d'authentification
gcal calendars list
```

Le token d'authentification sera sauvegardé dans `~/.gcal-commander/token.json` et actualisé automatiquement quand nécessaire.

## Utilisation de Base

```bash
# Lister tous vos calendriers
gcal calendars list

# Lister les événements à venir de votre calendrier principal
gcal events list

# Lister les événements d'un calendrier spécifique
gcal events list my-calendar@gmail.com

# Afficher des informations détaillées sur un événement
gcal events show <event-id>

# Créer un nouvel événement
gcal events create "Réunion d'Équipe" --start "2024-01-15T14:00:00" --duration 60

# Créer un événement de toute la journée
gcal events create "Conférence" --start "2024-01-15" --all-day

# Limiter le nombre d'événements et la plage de temps
gcal events list --max-results 5 --days 7

# Utiliser le mode silencieux pour les scripts (supprime les messages de statut)
gcal events list --quiet --format json | jq '.[] | .summary'

# Exemples de configuration
gcal config set defaultCalendar work@company.com
gcal events list  # Utilise maintenant work@company.com par défaut
```

## Configuration

gcal-commander supporte la configuration globale pour personnaliser le comportement par défaut :

```bash
# Définir le calendrier par défaut pour la liste d'événements
gcal config set defaultCalendar work@company.com

# Définir le nombre par défaut d'événements à afficher
gcal config set events.maxResults 25

# Définir le format de sortie par défaut
gcal config set events.format json

# Définir la plage de temps par défaut (jours)
gcal config set events.days 60

# Voir toute la configuration actuelle
gcal config list

# Voir une valeur de configuration spécifique
gcal config get defaultCalendar

# Supprimer un paramètre de configuration
gcal config unset defaultCalendar

# Réinitialiser toute la configuration
gcal config reset --confirm
```

### Options de Configuration

- `defaultCalendar` - ID de calendrier par défaut pour `gcal events list` (défaut : "primary")
- `events.maxResults` - Nombre maximum par défaut d'événements (1-100, défaut : 10)
- `events.format` - Format de sortie par défaut : "table", "json", ou "pretty-json" (défaut : "table")
- `events.days` - Nombre par défaut de jours à regarder en avant (1-365, défaut : 30)
- `language` - Langue de l'interface : "en", "ja", "es", "de", "pt", "fr", ou "ko" (défaut : "en")

La configuration est stockée dans `~/.gcal-commander/config.json` et peut être éditée manuellement.

## Commandes

gcal-commander fournit plusieurs commandes pour interagir avec Google Calendar :

### Gestion des Calendriers
- **[`gcal calendars list`](calendars-list.md)** - Lister tous les calendriers disponibles

### Gestion des Événements  
- **[`gcal events list`](events-list.md)** - Lister les événements de calendrier à venir
- **[`gcal events show`](events-show.md)** - Afficher les informations détaillées d'un événement
- **[`gcal events create`](events-create.md)** - Créer de nouveaux événements de calendrier avec des options de planification flexibles

### Configuration
- **[`gcal config`](config.md)** - Gérer les paramètres de configuration globaux

### Configuration et Authentification
- **[`gcal init`](init.md)** - Vérifier la configuration d'authentification Google Calendar

### Aide
- **`gcal help`** - Afficher l'aide pour n'importe quelle commande

Pour des exemples d'utilisation détaillés et des options pour chaque commande, cliquez sur les liens ci-dessus pour voir la documentation complète.

## Contribuer

Nous accueillons les contributions à gcal-commander ! Ce projet embrasse le développement assisté par IA.

### Flux de Travail de Développement Recommandé

- **Utilisez [Claude Code](https://claude.ai/code)** pour l'assistance au développement - de l'implémentation de fonctionnalités aux revues de code
- **Assurance Qualité** : Faites réviser vos changements par Claude Code pour la qualité du code, les meilleures pratiques et la cohérence
- **Tests** : Assurez-vous que tous les tests passent avec `npm test`
- **Linting** : Le code est automatiquement linté et formaté via des hooks pre-commit

### Configuration de Développement

1. Forkez et clonez le dépôt
2. Installez les dépendances : `npm install`
3. **Flux de travail de développement** :
   - **Pour le développement actif** : Utilisez `./bin/dev.js COMMAND` pour exécuter les commandes directement depuis les fichiers source TypeScript (pas de build requis)
   - **Pour les tests finaux** : Utilisez `npm run build && ./bin/run.js COMMAND` pour tester le build de production
4. Effectuez vos changements et lancez les tests : `npm test`
5. Soumettez une pull request

**Modes d'Exécution CLI :**
- `./bin/dev.js` - Mode développement (fichiers source TypeScript avec ts-node, changements instantanés)
- `./bin/run.js` - Mode production (JavaScript compilé depuis dist/, nécessite un build)

Le projet utilise Husky + lint-staged pour les vérifications automatiques de qualité de code avant les commits.

## Support Linguistique

gcal-commander supporte l'internationalisation (i18n) et est disponible en plusieurs langues :

**Langues Supportées :**
- **English** (`en`) - Par défaut
- **Japanese** (`ja`) - 日本語  
- **Spanish** (`es`) - Español
- **German** (`de`) - Deutsch
- **Portuguese** (`pt`) - Português
- **French** (`fr`) - Français
- **Korean** (`ko`) - 한국어

```bash
# Passer au japonais
gcal config set language ja

# Passer à l'espagnol
gcal config set language es

# Passer à l'allemand
gcal config set language de

# Passer au portugais
gcal config set language pt

# Passer au français
gcal config set language fr

# Passer au coréen
gcal config set language ko

# Revenir à l'anglais  
gcal config set language en

# Voir la configuration de langue actuelle
gcal config get language
```

Tous les messages de sortie de commandes, messages d'erreur et messages de statut seront affichés dans la langue sélectionnée.