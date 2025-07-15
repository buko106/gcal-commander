# gcal events show

Affiche des informations détaillées sur un événement de calendrier spécifique.

## Utilisation

```bash
gcal events show <event-id> [options]
```

## Arguments

| Argument | Description | Requis |
|----------|-------------|--------|
| `event-id` | ID de l'événement pour afficher les détails | Oui |

## Options

| Drapeau | Abrév. | Description | Par défaut |
|---------|--------|-------------|------------|
| `--calendar` | `-c` | ID du calendrier où l'événement existe | `primary` |
| `--fields` | | Liste séparée par des virgules des champs à afficher en format tableau | Tous les champs |
| `--format` | `-f` | Format de sortie (table, json, pretty-json) | `table` |
| `--quiet` | `-q` | Masquer la sortie non essentielle (messages de statut, indicateurs de progression) | `false` |

## Exemples

### Utilisation de base

```bash
# Afficher les détails de l'événement du calendrier principal
gcal events show abc123def456

# Afficher l'événement d'un calendrier spécifique
gcal events show abc123def456 --calendar work@company.com

# Obtenir les détails de l'événement en format JSON
gcal events show abc123def456 --format json
```

### Utilisation avancée

```bash
# Afficher l'événement silencieusement (pour les scripts)
gcal events show abc123def456 --quiet --format json

# Afficher l'événement d'un calendrier spécifique en format JSON
gcal events show abc123def456 --calendar team@company.com --format json
```

## Obtenir les IDs d'événements

Les IDs d'événements peuvent être obtenus de :

1. **Sortie de la commande `gcal events list`**
2. **URLs Google Calendar** (la longue chaîne dans l'URL)
3. **Réponses de l'API Calendar** (lors de l'utilisation du format JSON)

Exemple pour trouver les IDs d'événements :
```bash
# Rechercher les IDs dans la liste d'événements
gcal events list --format json | jq '.[] | {id, summary}'
```

## Formats de sortie

**Format tableau (par défaut) :**
```
=== Détails de l'événement ===

Titre : Réunion d'équipe
ID : abc123def456
Description : Réunion hebdomadaire de synchronisation d'équipe
Lieu : Salle de conférence A
Statut : confirmed
Début : 15 janvier 2024 (lun) • 9h00
Fin : 15 janvier 2024 (lun) • 10h00
Créateur : Pierre Dupont
Organisateur : Marie Martin

Participants :
  1. pierre@company.com (accepted)
  2. marie@company.com (tentative)

Lien Google Calendar : https://calendar.google.com/event?eid=...
Créé : 10/1/2024 8:30:00
Dernière mise à jour : 12/1/2024 15:45:00
```

**Format JSON :**
```json
{
  "id": "abc123def456",
  "summary": "Réunion d'équipe",
  "description": "Réunion hebdomadaire de synchronisation d'équipe",
  "start": {
    "dateTime": "2024-01-15T09:00:00-08:00",
    "timeZone": "America/Los_Angeles"
  },
  "end": {
    "dateTime": "2024-01-15T10:00:00-08:00",
    "timeZone": "America/Los_Angeles"
  },
  "location": "Salle de conférence A",
  "attendees": [
    {
      "email": "pierre@company.com",
      "responseStatus": "accepted"
    },
    {
      "email": "marie@company.com",
      "responseStatus": "needsAction"
    }
  ],
  "status": "confirmed",
  "created": "2024-01-10T08:30:00.000Z",
  "updated": "2024-01-12T15:45:00.000Z"
}
```

## Détails de l'événement affichés

Cette commande affiche des informations complètes sur l'événement incluant :

- **Informations de base** : Titre, description, ID de l'événement
- **Informations temporelles** : Heures de début/fin avec informations de fuseau horaire
- **Lieu** : Lieu physique ou de réunion virtuelle
- **Participants** : Adresses e-mail et statuts de réponse
- **Statut** : Statut de l'événement (confirmed, tentative, cancelled)
- **Métadonnées** : Horodatages de création et dernière mise à jour
- **Récurrence** : Règles de récurrence (si applicable)
- **Rappels** : Rappels par défaut et personnalisés

## Cas d'utilisation courants

### Vérification d'événement
```bash
# Vérifier rapidement les détails de l'événement avant une réunion
gcal events show $(gcal events list --format json | jq -r '.[0].id')
```

### Informations sur les participants
```bash
# Extraire les adresses e-mail des participants de l'événement
gcal events show abc123 --format json | jq -r '.attendees[]?.email'
```

### Vérification de réservation de salle
```bash
# Vérifier les détails de lieu et horaire
gcal events show abc123 | grep -E "(Lieu|Début|Fin)"
```

### Export des données d'événement
```bash
# Obtenir les données complètes de l'événement pour traitement externe
gcal events show abc123 --format json --quiet > event-details.json
```

## Gestion des erreurs

Erreurs courantes et solutions :

- **Événement non trouvé** : Vérifier l'ID de l'événement et le calendrier
- **Accès refusé** : Vérifier les permissions d'accès au calendrier spécifié
- **ID d'événement invalide** : Vérifier le format de l'ID d'événement et la source

## Commandes liées

- [`gcal events list`](events-list.md) - Trouver les IDs d'événements pour utiliser avec cette commande
- [`gcal calendars list`](calendars-list.md) - Trouver les IDs de calendriers disponibles
- [`gcal config`](config.md) - Configurer les paramètres par défaut