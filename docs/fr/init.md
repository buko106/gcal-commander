# gcal init

Vérifie la configuration d'authentification Google Calendar et teste la connectivité à l'API Google Calendar.

## Utilisation

```bash
gcal init [options]
```

## Options

| Drapeau | Abrév. | Description | Par défaut |
|---------|--------|-------------|------------|
| `--format` | `-f` | Format de sortie (table, json, pretty-json) | `table` |
| `--quiet` | `-q` | Masquer la sortie non essentielle (messages de statut, indicateurs de progression) | `false` |

## Description

La commande `init` vérifie que l'authentification Google Calendar fonctionne correctement. Elle effectue une connexion de test à l'API Google Calendar pour vérifier :

- Les fichiers d'identification sont correctement configurés
- Les jetons d'authentification sont valides
- Vous avez accès à Google Calendar

Cette commande est particulièrement utile pour :
- Configuration initiale de gcal-commander
- Dépannage des problèmes d'authentification
- Vérification de la configuration après avoir apporté des modifications aux identifiants

## Exemples

### Utilisation de base

```bash
# Vérifier l'authentification avec invite de confirmation
gcal init

# Vérifier l'authentification silencieusement (pour les scripts)
gcal init --quiet
```

## Flux interactif

Lors de l'exécution de `gcal init`, vous verrez une invite de confirmation pour la vérification d'authentification :

```
Ceci vérifiera l'authentification Google Calendar.
? Vérifier l'authentification ? (Y/n) 
```

- Appuyez sur Entrée ou tapez `y` pour continuer avec la vérification
- Tapez `n` pour annuler l'opération

**Note** : Le message de statut initial "Ceci vérifiera l'authentification Google Calendar." est toujours affiché, même lors de l'utilisation du drapeau `--quiet`. Le drapeau `--quiet` masque seulement le message de progression "Vérification de l'authentification Google Calendar...".

## Sortie de succès

Lorsque l'authentification réussit :

```
✓ Vérification de l'authentification Google Calendar...
Authentification réussie !
```

## Gestion des erreurs

Si l'authentification échoue, vous verrez un message d'erreur avec des informations de dépannage :

```
✗ Vérification de l'authentification Google Calendar...
Erreur d'authentification : [détails de l'erreur]
Réessayez la commande ou vérifiez vos identifiants de l'API Google Calendar.
```

Erreurs d'authentification courantes :
- Fichier d'identifiants manquant ou invalide
- Jetons d'authentification expirés
- Permissions insuffisantes
- Problèmes de connectivité réseau

## Prérequis

Avant d'exécuter `gcal init`, assurez-vous d'avoir :

1. **API Google Calendar activée** - Activée dans Google Cloud Console
2. **Identifiants OAuth 2.0** - Téléchargés et placés dans `~/.gcal-commander/credentials.json`
3. **Accès réseau** - Accès aux APIs de Google

Si vous n'avez pas encore configuré l'authentification, suivez le guide de [Configuration initiale](../README.md#configuration-initiale) dans le README.

## Dépannage

### Échec d'authentification

Si `gcal init` échoue :

1. **Vérifier le fichier d'identifiants** : Assurez-vous que `~/.gcal-commander/credentials.json` existe et contient des identifiants OAuth 2.0 valides
2. **Régénérer le jeton** : Supprimez `~/.gcal-commander/token.json` et exécutez n'importe quelle commande gcal pour vous ré-authentifier
3. **Vérifier l'accès à l'API** : Confirmez que l'API Google Calendar est activée dans Google Cloud Console
4. **Vérifier le réseau** : Assurez-vous d'avoir un accès internet et pouvez atteindre les serveurs de Google

### Permissions de fichier

Si vous rencontrez des erreurs de permissions :

```bash
# Vérifier les permissions de fichier
ls -la ~/.gcal-commander/

# Corriger les permissions si nécessaire
chmod 600 ~/.gcal-commander/credentials.json
chmod 600 ~/.gcal-commander/token.json
```

## Cas d'utilisation

- **Vérification de configuration initiale** - Confirmer que l'authentification fonctionne après la configuration
- **Dépannage** - Diagnostiquer les problèmes d'authentification
- **Intégration CI/CD** - Vérifier l'authentification dans des environnements automatisés
- **Vérification de santé** - Vérifier périodiquement que l'authentification est toujours valide

## Commandes liées

- [`gcal calendars list`](calendars-list.md) - Lister les calendriers disponibles (teste aussi l'authentification)
- [`gcal events list`](events-list.md) - Lister les événements (nécessite l'authentification)
- [`gcal config`](config.md) - Gérer la configuration

## Références

- [Guide de configuration initiale](../README.md#configuration-initiale) - Étapes complètes de configuration
- [Configuration de l'API Google Calendar](https://console.cloud.google.com/) - Google Cloud Console