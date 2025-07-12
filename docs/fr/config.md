# gcal config

Gère la configuration globale de gcal-commander. Définit les valeurs par défaut pour les commandes afin de personnaliser votre expérience.

## Utilisation

```bash
gcal config <sous-commande> [clé] [valeur] [options]
```

## Sous-commandes

| Sous-commande | Description |
|---------------|-------------|
| `get <clé>` | Obtenir une valeur de configuration |
| `set <clé> <valeur>` | Définir une valeur de configuration |
| `list` | Lister toute la configuration |
| `unset <clé>` | Supprimer une configuration |
| `reset` | Remettre toute la configuration aux valeurs par défaut |

## Options

| Drapeau | Description |
|---------|-------------|
| `--confirm` | Ignorer la confirmation lors de la remise à zéro |
| `--format` | Format de sortie (table, json, pretty-json) |
| `--quiet` | Masquer la sortie non essentielle (messages de statut, indicateurs de progression) |

## Clés de configuration

### Configuration principale

| Clé | Description | Par défaut | Valeurs valides |
|-----|-------------|------------|-----------------|
| `defaultCalendar` | Calendrier par défaut pour lister les événements | `primary` | N'importe quel ID de calendrier |
| `language` | Langue d'affichage | `en` | `en`, `ja` |

### Valeurs par défaut pour les commandes d'événements

| Clé | Description | Par défaut | Valeurs valides |
|-----|-------------|------------|-----------------|
| `events.maxResults` | Nombre maximum par défaut d'événements à retourner | `10` | `1-100` |
| `events.format` | Format de sortie par défaut | `table` | `table`, `json`, `pretty-json` |
| `events.days` | Jours par défaut à rechercher dans le futur | `30` | `1-365` |

## Exemples

### Configuration de base

```bash
# Définir le calendrier par défaut
gcal config set defaultCalendar work@company.com

# Obtenir le calendrier par défaut actuel
gcal config get defaultCalendar

# Lister toute la configuration actuelle
gcal config list

# Supprimer une configuration (revenir au défaut)
gcal config unset defaultCalendar
```

### Configuration de langue

```bash
# Changer vers le français
gcal config set language fr

# Changer vers l'anglais
gcal config set language en

# Vérifier le paramètre de langue actuel
gcal config get language
```

### Valeurs par défaut pour les commandes d'événements

```bash
# Définir le nombre par défaut d'événements affichés
gcal config set events.maxResults 25

# Définir la plage de temps par défaut
gcal config set events.days 60

# Définir le format de sortie par défaut
gcal config set events.format json

# Voir les paramètres d'événements
gcal config get events.maxResults
gcal config get events.days
gcal config get events.format
```

### Gestion de la configuration

```bash
# Afficher toute la configuration en format tableau
gcal config list

# Afficher toute la configuration en format JSON
gcal config list --format json

# Remettre toute la configuration à zéro (avec confirmation)
gcal config reset

# Remettre toute la configuration à zéro (ignorer la confirmation)
gcal config reset --confirm
```

## Formats de sortie

### Commande list - Format tableau (par défaut)
```
Clé                     Valeur
────────────────────────────────────
defaultCalendar         work@company.com
language                fr
events.maxResults       25
events.format           json
events.days             60
```

### Commande list - Format JSON
```json
{
  "defaultCalendar": "work@company.com",
  "language": "fr",
  "events": {
    "maxResults": 25,
    "format": "json",
    "days": 60
  }
}
```

### Commande get
```bash
$ gcal config get defaultCalendar
work@company.com
```

## Fichier de configuration

La configuration est stockée dans `~/.gcal-commander/config.json` :

```json
{
  "defaultCalendar": "work@company.com",
  "language": "fr",
  "events": {
    "maxResults": 25,
    "format": "table",
    "days": 60
  }
}
```

Vous pouvez éditer ce fichier manuellement si nécessaire, mais l'utilisation de la commande config est recommandée.

## Flux de travail courants

### Configuration pour le travail
```bash
# Configuration pour le travail
gcal config set defaultCalendar work@company.com
gcal config set events.maxResults 20
gcal config set events.days 14
gcal config set events.format table
gcal config set language fr
```

### Configuration pour les scripts
```bash
# Configuration pour l'automatisation/scripts
gcal config set events.format json
gcal config set events.maxResults 100
gcal config set language en
```

### Gestion de multiples calendriers
```bash
# Définir le calendrier de travail principal
gcal config set defaultCalendar primary-work@company.com

# Utiliser ce calendrier par défaut dans les listes d'événements
gcal events list  # Utilise primary-work@company.com

# Surcharger pour des requêtes spécifiques
gcal events list personal@gmail.com
```

## Validation

Les valeurs de configuration sont validées lors de leur définition :

- **IDs de calendrier** : Non validés jusqu'à la première utilisation
- **Plages numériques** : `maxResults` (1-100), `days` (1-365)
- **Énumérations** : `format` doit être "table", "json" ou "pretty-json"
- **Langue** : `language` doit être "en" ou "ja"
- **Valeurs invalides** : La commande affichera une erreur et les options valides actuelles

## Impact sur les commandes

La configuration affecte le comportement par défaut des commandes :

### [`gcal events list`](events-list.md)
- Utilise `defaultCalendar` si aucun calendrier n'est spécifié
- Utilise `events.maxResults` comme valeur par défaut pour `--max-results`
- Utilise `events.format` comme valeur par défaut pour `--format`
- Utilise `events.days` comme valeur par défaut pour `--days`

### [`gcal events show`](events-show.md)
- Utilise `defaultCalendar` comme valeur par défaut pour `--calendar` si non spécifié

### Toutes les commandes
- Affichent les messages basés sur le paramètre `language`

Les drapeaux de ligne de commande surchargent toujours les valeurs par défaut de configuration.

## Dépannage

### Remettre la configuration à zéro
Si vous avez des problèmes avec la configuration :
```bash
gcal config reset --confirm
```

### Voir la configuration actuelle
```bash
gcal config list --format json
```

### Vérifier une configuration spécifique
```bash
gcal config get defaultCalendar
```

## Commandes liées

- [`gcal events list`](events-list.md) - Utilise les valeurs par défaut de configuration
- [`gcal events show`](events-show.md) - Utilise les valeurs par défaut de configuration
- [`gcal calendars list`](calendars-list.md) - Trouver les IDs de calendriers pour la configuration