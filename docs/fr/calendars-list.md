# gcal calendars list

Liste tous les calendriers accessibles via votre compte Google.

## Utilisation

```bash
gcal calendars list [options]
```

## Options

| Drapeau | Abrév. | Description | Par défaut |
|---------|--------|-------------|------------|
| `--fields` | | Liste séparée par des virgules des champs à afficher en format tableau | Tous les champs |
| `--format` | `-f` | Format de sortie (table, json, pretty-json) | `table` |
| `--quiet` | `-q` | Masquer la sortie non essentielle (messages de statut, indicateurs de progression) | `false` |

## Exemples

### Utilisation de base

```bash
# Lister tous les calendriers en format tableau
gcal calendars list

# Lister les calendriers en format JSON
gcal calendars list --format json

# Lister les calendriers silencieusement (sans messages de statut)
gcal calendars list --quiet

# Afficher seulement les noms de calendriers et IDs
gcal calendars list --fields name,id

# Afficher seulement les noms (pour aperçu rapide)
gcal calendars list --fields name
```

### Formats de sortie

**Format tableau (par défaut) :**
```
Calendriers disponibles (3 trouvés) :

1. Pierre Dupont (Principal)
   ID: primary
   Accès: owner

2. Calendrier de Travail
   ID: work@company.com
   Accès: owner

3. Événements Familiaux
   ID: family@gmail.com
   Accès: reader
```

**Format JSON :**
```json
[
  {
    "id": "primary",
    "summary": "Pierre Dupont",
    "primary": true,
    "accessRole": "owner"
  },
  {
    "id": "work@company.com",
    "summary": "Calendrier de Travail",
    "accessRole": "owner"
  }
]
```

## Personnalisation des champs de tableau

Vous pouvez personnaliser les colonnes affichées en format tableau en utilisant le flag `--fields` :

### Champs disponibles
- `name` - Nom/résumé du calendrier
- `id` - ID du calendrier
- `access` - Rôle d'accès (owner, reader, writer, etc.)
- `primary` - Indicateur de calendrier principal
- `description` - Description du calendrier
- `color` - Couleur du calendrier

### Exemples
```bash
# Afficher seulement le nom et l'ID (cas d'utilisation le plus courant)
gcal calendars list --fields name,id

# Afficher nom, ID et rôle d'accès
gcal calendars list --fields name,id,access

# Afficher seulement les noms pour aperçu rapide
gcal calendars list --fields name

# Afficher les couleurs de calendriers et l'accès
gcal calendars list --fields name,color,access
```

**Note** : Le flag `--fields` n'affecte que la sortie en format tableau. La sortie JSON inclut toujours tous les champs disponibles.

## Cas d'utilisation

- **Découverte de calendriers** - Voir tous les calendriers auxquels vous avez accès
- **Recherche d'IDs de calendriers** - Obtenir les IDs exacts des calendriers pour utiliser dans d'autres commandes
- **Scripts** - Analyser les données des calendriers programmatiquement avec `--format json`
- **Aperçu rapide** - Vérifier les calendriers disponibles avant de lister les événements

## Intégration avec d'autres commandes

Les IDs de calendriers retournés par cette commande peuvent être utilisés dans :

- [`gcal events list <calendar-id>`](events-list.md) - Lister les événements d'un calendrier spécifique
- [`gcal events show <event-id> --calendar <calendar-id>`](events-show.md) - Afficher les détails d'événements d'un calendrier spécifique
- [`gcal config set defaultCalendar <calendar-id>`](config.md) - Définir le calendrier par défaut

## Commandes liées

- [`gcal events list`](events-list.md) - Lister les événements des calendriers
- [`gcal config`](config.md) - Configurer les paramètres par défaut du calendrier