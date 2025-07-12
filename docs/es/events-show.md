# gcal events show

Muestra información detallada de un evento de calendario específico.

## Uso

```bash
gcal events show <event-id> [opciones]
```

## Argumentos

| Argumento | Descripción | Requerido |
|-----------|-------------|-----------|
| `event-id` | ID del evento para mostrar detalles | Sí |

## Opciones

| Bandera | Abrev. | Descripción | Por defecto |
|---------|--------|-------------|-------------|
| `--calendar` | `-c` | ID del calendario donde existe el evento | `primary` |
| `--format` | `-f` | Formato de salida (table, json, pretty-json) | `table` |
| `--quiet` | `-q` | Ocultar salida no esencial (mensajes de estado, indicadores de progreso) | `false` |

## Ejemplos

### Uso básico

```bash
# Mostrar detalles de evento del calendario principal
gcal events show abc123def456

# Mostrar evento de un calendario específico
gcal events show abc123def456 --calendar work@company.com

# Obtener detalles del evento en formato JSON
gcal events show abc123def456 --format json
```

### Uso avanzado

```bash
# Mostrar evento silenciosamente (para scripts)
gcal events show abc123def456 --quiet --format json

# Mostrar evento de calendario específico en formato JSON
gcal events show abc123def456 --calendar team@company.com --format json
```

## Obtener IDs de eventos

Los IDs de eventos pueden obtenerse de:

1. **Salida del comando `gcal events list`**
2. **URLs de Google Calendar** (la cadena larga en la URL)
3. **Respuestas de la API de Calendar** (cuando se usa formato JSON)

Ejemplo para encontrar IDs de eventos:
```bash
# Buscar IDs en listado de eventos
gcal events list --format json | jq '.[] | {id, summary}'
```

## Formatos de salida

**Formato tabla (por defecto):**
```
=== Detalles del evento ===

Título: Reunión de equipo
ID: abc123def456
Descripción: Reunión semanal de sincronización del equipo
Ubicación: Sala de conferencias A
Estado: confirmed
Inicio: 15 de enero de 2024 (lun) • 9:00 AM
Fin: 15 de enero de 2024 (lun) • 10:00 AM
Creador: Carlos García
Organizador: María Rodríguez

Asistentes:
  1. carlos@company.com (accepted)
  2. maria@company.com (tentative)

Enlace de Google Calendar: https://calendar.google.com/event?eid=...
Creado: 10/1/2024 8:30:00
Última actualización: 12/1/2024 15:45:00
```

**Formato JSON:**
```json
{
  "id": "abc123def456",
  "summary": "Reunión de equipo",
  "description": "Reunión semanal de sincronización del equipo",
  "start": {
    "dateTime": "2024-01-15T09:00:00-08:00",
    "timeZone": "America/Los_Angeles"
  },
  "end": {
    "dateTime": "2024-01-15T10:00:00-08:00",
    "timeZone": "America/Los_Angeles"
  },
  "location": "Sala de conferencias A",
  "attendees": [
    {
      "email": "carlos@company.com",
      "responseStatus": "accepted"
    },
    {
      "email": "maria@company.com",
      "responseStatus": "needsAction"
    }
  ],
  "status": "confirmed",
  "created": "2024-01-10T08:30:00.000Z",
  "updated": "2024-01-12T15:45:00.000Z"
}
```

## Detalles del evento mostrados

Este comando muestra información completa del evento incluyendo:

- **Información básica**: Título, descripción, ID del evento
- **Información de tiempo**: Fechas/horas de inicio y fin con información de zona horaria
- **Ubicación**: Ubicación física o de reunión virtual
- **Asistentes**: Direcciones de correo y estados de respuesta
- **Estado**: Estado del evento (confirmed, tentative, cancelled)
- **Metadatos**: Marcas de tiempo de creación y última actualización
- **Recurrencia**: Reglas de recurrencia (si aplican)
- **Recordatorios**: Recordatorios por defecto y personalizados

## Casos de uso comunes

### Verificación de eventos
```bash
# Verificar rápidamente detalles del evento antes de una reunión
gcal events show $(gcal events list --format json | jq -r '.[0].id')
```

### Información de asistentes
```bash
# Extraer direcciones de correo de asistentes del evento
gcal events show abc123 --format json | jq -r '.attendees[]?.email'
```

### Verificación de reserva de salas
```bash
# Verificar detalles de ubicación y tiempo
gcal events show abc123 | grep -E "(Ubicación|Inicio|Fin)"
```

### Exportación de datos del evento
```bash
# Obtener datos completos del evento para procesamiento externo
gcal events show abc123 --format json --quiet > event-details.json
```

## Manejo de errores

Errores comunes y soluciones:

- **Evento no encontrado**: Verificar ID del evento y calendario
- **Acceso denegado**: Verificar permisos de acceso al calendario especificado
- **ID de evento inválido**: Verificar formato del ID del evento y fuente

## Comandos relacionados

- [`gcal events list`](events-list.md) - Buscar IDs de eventos para usar con este comando
- [`gcal calendars list`](calendars-list.md) - Buscar IDs de calendarios disponibles
- [`gcal config`](config.md) - Configurar ajustes por defecto