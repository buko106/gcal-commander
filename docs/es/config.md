# gcal config

Gestiona la configuración global de gcal-commander. Establece valores por defecto para comandos para personalizar tu experiencia.

## Uso

```bash
gcal config <subcomando> [clave] [valor] [opciones]
```

## Subcomandos

| Subcomando | Descripción |
|------------|-------------|
| `get <clave>` | Obtener un valor de configuración |
| `set <clave> <valor>` | Establecer un valor de configuración |
| `list` | Listar toda la configuración |
| `unset <clave>` | Eliminar una configuración |
| `reset` | Restablecer toda la configuración a valores por defecto |

## Opciones

| Bandera | Descripción |
|---------|-------------|
| `--confirm` | Omitir confirmación al restablecer |
| `--format` | Formato de salida (table, json, pretty-json) |
| `--quiet` | Ocultar salida no esencial (mensajes de estado, indicadores de progreso) |

## Claves de configuración

### Configuración central

| Clave | Descripción | Por defecto | Valores válidos |
|-------|-------------|-------------|-----------------|
| `defaultCalendar` | Calendario por defecto para listar eventos | `primary` | Cualquier ID de calendario |
| `language` | Idioma de visualización | `en` | `en`, `ja` |

### Valores por defecto para comandos de eventos

| Clave | Descripción | Por defecto | Valores válidos |
|-------|-------------|-------------|-----------------|
| `events.maxResults` | Número máximo por defecto de eventos a devolver | `10` | `1-100` |
| `events.format` | Formato de salida por defecto | `table` | `table`, `json`, `pretty-json` |
| `events.days` | Días por defecto para buscar hacia adelante | `30` | `1-365` |

## Ejemplos

### Configuración básica

```bash
# Establecer calendario por defecto
gcal config set defaultCalendar work@company.com

# Obtener el calendario por defecto actual
gcal config get defaultCalendar

# Listar toda la configuración actual
gcal config list

# Eliminar una configuración (volver al valor por defecto)
gcal config unset defaultCalendar
```

### Configuración de idioma

```bash
# Cambiar a español
gcal config set language es

# Cambiar a inglés
gcal config set language en

# Verificar configuración de idioma actual
gcal config get language
```

### Valores por defecto para comandos de eventos

```bash
# Establecer número por defecto de eventos mostrados
gcal config set events.maxResults 25

# Establecer rango de tiempo por defecto
gcal config set events.days 60

# Establecer formato de salida por defecto
gcal config set events.format json

# Ver configuraciones de eventos
gcal config get events.maxResults
gcal config get events.days
gcal config get events.format
```

### Gestión de configuración

```bash
# Mostrar toda la configuración en formato tabla
gcal config list

# Mostrar toda la configuración en formato JSON
gcal config list --format json

# Restablecer toda la configuración (con confirmación)
gcal config reset

# Restablecer toda la configuración (omitir confirmación)
gcal config reset --confirm
```

## Formatos de salida

### Comando list - Formato tabla (por defecto)
```
Clave                   Valor
────────────────────────────────────
defaultCalendar         work@company.com
language                es
events.maxResults       25
events.format           json
events.days             60
```

### Comando list - Formato JSON
```json
{
  "defaultCalendar": "work@company.com",
  "language": "es",
  "events": {
    "maxResults": 25,
    "format": "json",
    "days": 60
  }
}
```

### Comando get
```bash
$ gcal config get defaultCalendar
work@company.com
```

## Archivo de configuración

La configuración se almacena en `~/.gcal-commander/config.json`:

```json
{
  "defaultCalendar": "work@company.com",
  "language": "es",
  "events": {
    "maxResults": 25,
    "format": "table",
    "days": 60
  }
}
```

Puedes editar este archivo manualmente si es necesario, pero se recomienda usar el comando config.

## Flujos de trabajo comunes

### Configuración para el trabajo
```bash
# Configuración para trabajo
gcal config set defaultCalendar work@company.com
gcal config set events.maxResults 20
gcal config set events.days 14
gcal config set events.format table
gcal config set language es
```

### Configuración para scripts
```bash
# Configuración para automatización/scripts
gcal config set events.format json
gcal config set events.maxResults 100
gcal config set language en
```

### Gestión de múltiples calendarios
```bash
# Establecer calendario de trabajo principal
gcal config set defaultCalendar primary-work@company.com

# Usar este calendario por defecto en listados de eventos
gcal events list  # Usa primary-work@company.com

# Anular para consultas específicas
gcal events list personal@gmail.com
```

## Validación

Los valores de configuración se validan al establecerlos:

- **IDs de calendario**: No se validan hasta el primer uso
- **Rangos numéricos**: `maxResults` (1-100), `days` (1-365)
- **Enumeraciones**: `format` debe ser "table", "json", o "pretty-json"
- **Idioma**: `language` debe ser "en" o "ja"
- **Valores inválidos**: El comando mostrará un error y las opciones válidas actuales

## Impacto en comandos

La configuración afecta el comportamiento por defecto de los comandos:

### [`gcal events list`](events-list.md)
- Usa `defaultCalendar` si no se especifica calendario
- Usa `events.maxResults` como valor por defecto para `--max-results`
- Usa `events.format` como valor por defecto para `--format`
- Usa `events.days` como valor por defecto para `--days`

### [`gcal events show`](events-show.md)
- Usa `defaultCalendar` como valor por defecto para `--calendar` si no se especifica

### Todos los comandos
- Muestran mensajes basados en la configuración `language`

Las banderas de línea de comandos siempre anulan los valores por defecto de configuración.

## Solución de problemas

### Restablecer configuración
Si tienes problemas con la configuración:
```bash
gcal config reset --confirm
```

### Ver configuración actual
```bash
gcal config list --format json
```

### Verificar configuración específica
```bash
gcal config get defaultCalendar
```

## Comandos relacionados

- [`gcal events list`](events-list.md) - Usa valores por defecto de configuración
- [`gcal events show`](events-show.md) - Usa valores por defecto de configuración
- [`gcal calendars list`](calendars-list.md) - Buscar IDs de calendarios para configuración