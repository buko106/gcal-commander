# gcal events list

Liste les événements de calendrier à venir du calendrier spécifié ou par défaut.

## Utilisation

```bash
gcal events list [calendrier] [options]
```

## Arguments

| Argument | Description | Par défaut |
|----------|-------------|------------|
| `calendrier` | ID du calendrier duquel lister les événements | `primary` |

## Options

| Drapeau | Abrév. | Description | Par défaut |
|---------|--------|-------------|------------|
| `--days` | `-d` | Nombre de jours à rechercher dans le futur (1-365) | `30` |
| `--fields` | | Liste séparée par des virgules des champs à afficher en format tableau | Tous les champs |
| `--format` | `-f` | Format de sortie (table, json, pretty-json) | `table` |
| `--max-results` | `-n` | Nombre maximum d'événements à retourner (1-100) | `10` |
| `--quiet` | `-q` | Masquer la sortie non essentielle (messages de statut, indicateurs de progression) | `false` |

## Support de configuration

Cette commande supporte les valeurs par défaut de configuration globale :

- `defaultCalendar` - Calendrier par défaut à utiliser si aucun n'est spécifié
- `events.days` - Nombre par défaut de jours à rechercher dans le futur
- `events.format` - Format de sortie par défaut
- `events.maxResults` - Nombre maximum par défaut d'événements

Voir [`gcal config`](config.md) pour les détails sur la définition de ces valeurs.

## Exemples

### Utilisation de base

```bash
# Lister les événements du calendrier principal
gcal events list

# Lister les événements d'un calendrier spécifique
gcal events list work@company.com

# Lister les événements pour les 7 prochains jours
gcal events list --days 7

# Lister jusqu'à 20 événements
gcal events list --max-results 20
```

### Utilisation avancée

```bash
# Combiner plusieurs options
gcal events list personal@gmail.com --days 14 --max-results 5 --format json

# Mode silencieux pour les scripts
gcal events list --quiet --format json | jq '.[] | .summary'

# Utiliser les valeurs par défaut configurées
gcal config set defaultCalendar work@company.com
gcal config set events.days 14
gcal events list  # Utilise work@company.com pour 14 jours

# Personnaliser les colonnes de tableau
gcal events list --fields title,date,time
gcal events list --fields title,location --max-results 20
```

### Formats de sortie

**Format tableau (par défaut) :**
```
Événements à venir (2 trouvés) :

1. Réunion d'équipe
   15 janvier (lun) • 9h00 - 10h00
   Réunion hebdomadaire de synchronisation d'équipe

2. Revue de projet
   16 janvier (mar) • 14h00 - 15h30 @ Salle de conférence A
```

**Format JSON :**
```json
[
  {
    "id": "abc123",
    "summary": "Réunion d'équipe",
    "start": {
      "dateTime": "2024-01-15T09:00:00-08:00"
    },
    "end": {
      "dateTime": "2024-01-15T10:00:00-08:00"
    },
    "description": "Réunion hebdomadaire de synchronisation d'équipe"
  }
]
```

## Personnalisation des champs de tableau

Vous pouvez personnaliser les colonnes affichées en format tableau en utilisant le flag `--fields` :

### Champs disponibles
- `title` - Titre/résumé de l'événement
- `date` - Date de l'événement
- `time` - Heure de l'événement
- `location` - Lieu de l'événement
- `description` - Description de l'événement

### Exemples
```bash
# Afficher seulement le titre et la date
gcal events list --fields title,date

# Afficher titre, heure et lieu
gcal events list --fields title,time,location

# Afficher seulement les titres (pour aperçu rapide)
gcal events list --fields title
```

**Note** : Le flag `--fields` n'affecte que la sortie en format tableau. La sortie JSON inclut toujours tous les champs disponibles.

## Plages de temps et limites

- **Plage de jours** : 1-365 jours à partir d'aujourd'hui
- **Maximum de résultats** : 1-100 événements par requête
- **Fuseau horaire** : Les événements sont affichés dans le fuseau horaire local
- **Événements passés** : Seuls les événements futurs/actuels sont affichés

## Scripts et automatisation

### Extraire les titres d'événements
```bash
gcal events list --format json --quiet | jq -r '.[].summary'
```

### Obtenir seulement les événements d'aujourd'hui
```bash
gcal events list --days 1 --format json
```

### Compter les événements à venir
```bash
gcal events list --format json --quiet | jq 'length'
```

## Cas d'utilisation

- **Planification quotidienne** - Réviser les rendez-vous à venir dans votre calendrier
- **Aperçu du calendrier** - Vérification rapide des événements à venir
- **Scripts** - Extraire les données d'événements pour l'automatisation ou les rapports
- **Gestion de multiples calendriers** - Comparer les événements entre différents calendriers

## Commandes liées

- [`gcal calendars list`](calendars-list.md) - Trouver les IDs de calendriers disponibles
- [`gcal events show`](events-show.md) - Obtenir des informations détaillées sur des événements spécifiques
- [`gcal config`](config.md) - Définir les valeurs par défaut pour cette commande