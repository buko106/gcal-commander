# gcal events list

Lista próximos eventos de calendario del calendario especificado o del calendario por defecto.

## Uso

```bash
gcal events list [calendario] [opciones]
```

## Argumentos

| Argumento | Descripción | Por defecto |
|-----------|-------------|-------------|
| `calendario` | ID del calendario del cual listar eventos | `primary` |

## Opciones

| Bandera | Abrev. | Descripción | Por defecto |
|---------|--------|-------------|-------------|
| `--days` | `-d` | Número de días a buscar hacia adelante (1-365) | `30` |
| `--format` | `-f` | Formato de salida (table, json, pretty-json) | `table` |
| `--max-results` | `-n` | Número máximo de eventos a devolver (1-100) | `10` |
| `--quiet` | `-q` | Ocultar salida no esencial (mensajes de estado, indicadores de progreso) | `false` |

## Soporte de configuración

Este comando soporta valores por defecto de configuración global:

- `defaultCalendar` - Calendario por defecto a usar si no se especifica uno
- `events.days` - Número por defecto de días a buscar hacia adelante
- `events.format` - Formato de salida por defecto
- `events.maxResults` - Número máximo por defecto de eventos

Consulta [`gcal config`](config.md) para detalles sobre cómo establecer estos valores.

## Ejemplos

### Uso básico

```bash
# Listar eventos del calendario principal
gcal events list

# Listar eventos de un calendario específico
gcal events list work@company.com

# Listar eventos para los próximos 7 días
gcal events list --days 7

# Listar hasta 20 eventos
gcal events list --max-results 20
```

### Uso avanzado

```bash
# Combinar múltiples opciones
gcal events list personal@gmail.com --days 14 --max-results 5 --format json

# Modo silencioso para scripts
gcal events list --quiet --format json | jq '.[] | .summary'

# Usar valores por defecto configurados
gcal config set defaultCalendar work@company.com
gcal config set events.days 14
gcal events list  # Usa work@company.com por 14 días
```

### Formatos de salida

**Formato tabla (por defecto):**
```
Próximos eventos (2 encontrados):

1. Reunión de equipo
   15 de enero (lun) • 9:00 AM - 10:00 AM
   Reunión semanal de sincronización del equipo

2. Revisión de proyecto
   16 de enero (mar) • 2:00 PM - 3:30 PM @ Sala de conferencias A
```

**Formato JSON:**
```json
[
  {
    "id": "abc123",
    "summary": "Reunión de equipo",
    "start": {
      "dateTime": "2024-01-15T09:00:00-08:00"
    },
    "end": {
      "dateTime": "2024-01-15T10:00:00-08:00"
    },
    "description": "Reunión semanal de sincronización del equipo"
  }
]
```

## Rangos de tiempo y límites

- **Rango de días**: 1-365 días desde hoy
- **Máximo de resultados**: 1-100 eventos por solicitud
- **Zona horaria**: Los eventos se muestran en la zona horaria local
- **Eventos pasados**: Solo se muestran eventos futuros/actuales

## Scripting y automatización

### Extraer títulos de eventos
```bash
gcal events list --format json --quiet | jq -r '.[].summary'
```

### Obtener solo eventos de hoy
```bash
gcal events list --days 1 --format json
```

### Contar próximos eventos
```bash
gcal events list --format json --quiet | jq 'length'
```

## Casos de uso

- **Planificación diaria** - Revisar próximas citas en tu calendario
- **Resumen de calendario** - Verificación rápida de próximos eventos
- **Scripting** - Extraer datos de eventos para automatización o reportes
- **Gestión de múltiples calendarios** - Comparar eventos entre diferentes calendarios

## Comandos relacionados

- [`gcal calendars list`](calendars-list.md) - Buscar IDs de calendarios disponibles
- [`gcal events show`](events-show.md) - Obtener información detallada de eventos específicos
- [`gcal config`](config.md) - Establecer valores por defecto para este comando