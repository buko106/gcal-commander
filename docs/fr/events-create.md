# gcal events create

Crée de nouveaux événements de calendrier avec des options flexibles de planification, participants et métadonnées.

## Utilisation

```bash
gcal events create <résumé> [options]
```

## Arguments

| Argument | Description | Requis |
|----------|-------------|--------|
| `résumé` | Titre/résumé de l'événement | Oui |

## Options

| Drapeau | Abrév. | Description | Par défaut |
|---------|--------|-------------|------------|
| `--start` | `-s` | Date et heure de début (format ISO) | Requis |
| `--end` | `-e` | Date et heure de fin (format ISO) | - |
| `--duration` | `-d` | Durée en minutes (alternative à --end) | `60` |
| `--all-day` | | Créer un événement toute la journée | `false` |
| `--calendar` | `-c` | ID du calendrier où créer l'événement | `primary` |
| `--location` | `-l` | Lieu de l'événement | - |
| `--description` | | Description de l'événement | - |
| `--attendees` | | Liste séparée par des virgules d'adresses e-mail des participants | - |
| `--send-updates` | | Envoyer des invitations d'événement (all/externalOnly/none) | `none` |
| `--fields` | | Liste séparée par des virgules des champs à afficher en format tableau | Tous les champs |
| `--format` | `-f` | Format de sortie (table, json, pretty-json) | `table` |
| `--quiet` | `-q` | Masquer la sortie non essentielle (messages de statut, indicateurs de progression) | `false` |

## Spécification du temps

### Événements avec heure
Utilisez le format ISO 8601 pour les dates et heures :
```bash
# Format de base
gcal events create "Réunion" --start "2024-01-15T14:00:00"

# Avec fuseau horaire
gcal events create "Téléconférence" --start "2024-01-15T14:00:00-08:00"
```

### Événements toute la journée
Utilisez le format date seulement (YYYY-MM-DD) :
```bash
gcal events create "Conférence" --start "2024-01-15" --all-day
```

### Durée vs heure de fin
- Utilisez `--duration` en minutes pour la commodité
- Utilisez `--end` pour une heure de fin spécifique
- Vous ne pouvez pas spécifier à la fois `--end` et `--duration`

## Exemples

### Création d'événements de base

```bash
# Réunion simple d'1 heure (durée par défaut)
gcal events create "Réunion d'équipe" --start "2024-01-15T14:00:00"

# Réunion avec durée spécifique
gcal events create "Stand-up matinal" --start "2024-01-15T09:00:00" --duration 30

# Réunion avec heure de fin spécifique
gcal events create "Revue de projet" --start "2024-01-15T14:00:00" --end "2024-01-15T16:00:00"
```

### Événements toute la journée

```bash
# Événement d'un jour
gcal events create "Conférence" --start "2024-01-15" --all-day

# Événement multi-jours (la date de fin est exclusive)
gcal events create "Vacances" --start "2024-01-15" --end "2024-01-20" --all-day
```

### Événements avec métadonnées

```bash
# Réunion avec lieu
gcal events create "Réunion client" \
  --start "2024-01-15T14:00:00" \
  --duration 90 \
  --location "Salle de conférence A"

# Événement avec description
gcal events create "Planification du sprint" \
  --start "2024-01-15T10:00:00" \
  --duration 120 \
  --description "Planification des tâches pour le prochain sprint"
```

### Événements avec participants

```bash
# Ajouter des participants sans envoyer d'invitations
gcal events create "Synchronisation d'équipe" \
  --start "2024-01-15T14:00:00" \
  --attendees "alice@company.com,bob@company.com"

# Envoyer des invitations aux participants
gcal events create "Réunion importante" \
  --start "2024-01-15T14:00:00" \
  --attendees "alice@company.com,bob@company.com" \
  --send-updates all
```

### Calendriers différents

```bash
# Créer dans le calendrier de travail
gcal events create "Démo du sprint" \
  --start "2024-01-15T15:00:00" \
  --calendar work@company.com

# Créer dans le calendrier personnel
gcal events create "Rendez-vous médical" \
  --start "2024-01-15T10:00:00" \
  --calendar personal@gmail.com
```

### Exemples avancés

```bash
# Configuration complète de réunion
gcal events create "Revue trimestrielle" \
  --start "2024-01-15T14:00:00" \
  --end "2024-01-15T17:00:00" \
  --location "Salle de conférence principale" \
  --description "Résultats Q4 et planification Q1" \
  --attendees "team@company.com,manager@company.com" \
  --calendar work@company.com \
  --send-updates all

# Sortie JSON pour les scripts
gcal events create "Événement automatisé" \
  --start "2024-01-15T14:00:00" \
  --format json --quiet
```

## Formats de sortie

**Format tableau (par défaut) :**
```
Événement créé avec succès !

Titre : Réunion d'équipe
ID : abc123def456
Début : 15/1/2024 14:00:00
Fin : 15/1/2024 15:00:00
Lieu : Salle de conférence A
Lien Google Calendar : https://calendar.google.com/event?eid=...
```

**Format JSON :**
```json
{
  "id": "abc123def456",
  "summary": "Réunion d'équipe",
  "start": {
    "dateTime": "2024-01-15T14:00:00-08:00"
  },
  "end": {
    "dateTime": "2024-01-15T15:00:00-08:00"
  },
  "location": "Salle de conférence A",
  "htmlLink": "https://calendar.google.com/event?eid=..."
}
```

## Gestion des participants

### Options d'invitation
- `none` (par défaut) - Ajouter des participants mais ne pas envoyer d'invitations
- `all` - Envoyer des invitations à tous les participants
- `externalOnly` - Envoyer des invitations seulement aux participants externes

### Format des participants
Fournissez les adresses e-mail séparées par des virgules :
```bash
--attendees "alice@company.com,bob@external.com,charlie@company.com"
```

## Gestion des fuseaux horaires

- **Heure locale** : Si aucun fuseau horaire n'est spécifié, utilise le fuseau horaire local
- **Fuseau horaire explicite** : Inclure le décalage de fuseau horaire au format ISO
- **Événements toute la journée** : Format date seulement, indépendant du fuseau horaire

## Validation et gestion des erreurs

### Erreurs courantes
- **Format de date invalide** : Vérifiez le format ISO 8601 pour les événements avec heure
- **Spécifier à la fois end et duration** : Vous ne pouvez pas spécifier à la fois `--end` et `--duration`
- **Durée invalide** : Doit être un entier positif (minutes)
- **Dates dans le passé** : Un avertissement est affiché mais l'événement est créé

### Exemples de formats de date
```bash
# Formats valides
--start "2024-01-15T14:00:00"           # Fuseau horaire local
--start "2024-01-15T14:00:00-08:00"     # Heure du Pacifique
--start "2024-01-15T22:00:00Z"          # UTC
--start "2024-01-15" --all-day          # Événement toute la journée

# Formats invalides
--start "15 janvier 2024"               # Utilisez le format ISO
--start "14:00"                         # Date manquante
```

## Cas d'utilisation

- **Planification de réunions** - Créer des réunions avec participants et lieux
- **Planification d'événements** - Configurer des conférences, ateliers, événements sociaux
- **Rappels personnels** - Créer des rendez-vous et événements personnels
- **Configuration de récurrence** - Créer des événements modèles pour répétition manuelle
- **Automatisation** - Scripts pour créer des événements depuis des systèmes externes

## Commandes liées

- [`gcal events list`](events-list.md) - Voir les événements créés
- [`gcal events show`](events-show.md) - Obtenir des informations détaillées sur l'événement
- [`gcal calendars list`](calendars-list.md) - Trouver les IDs de calendriers disponibles
- [`gcal config`](config.md) - Configurer les paramètres par défaut