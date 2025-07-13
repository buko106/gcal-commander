# gcal events create

Crea nuevos eventos de calendario con opciones flexibles de programación, asistentes y metadatos.

## Uso

```bash
gcal events create <resumen> [opciones]
```

## Argumentos

| Argumento | Descripción | Requerido |
|-----------|-------------|-----------|
| `resumen` | Título/resumen del evento | Sí |

## Opciones

| Bandera | Abrev. | Descripción | Por defecto |
|---------|--------|-------------|-------------|
| `--start` | `-s` | Fecha y hora de inicio (formato ISO) | Requerido |
| `--end` | `-e` | Fecha y hora de fin (formato ISO) | - |
| `--duration` | `-d` | Duración en minutos (alternativa a --end) | `60` |
| `--all-day` | | Crear evento de todo el día | `false` |
| `--calendar` | `-c` | ID del calendario donde crear el evento | `primary` |
| `--location` | `-l` | Ubicación del evento | - |
| `--description` | | Descripción del evento | - |
| `--attendees` | | Lista separada por comas de direcciones de correo de asistentes | - |
| `--send-updates` | | Enviar invitaciones de evento (all/externalOnly/none) | `none` |
| `--format` | `-f` | Formato de salida (table, json, pretty-json) | `table` |
| `--quiet` | `-q` | Ocultar salida no esencial (mensajes de estado, indicadores de progreso) | `false` |

## Especificación de tiempo

### Eventos con hora
Usa formato ISO 8601 para fechas y horas:
```bash
# Formato básico
gcal events create "Reunión" --start "2024-01-15T14:00:00"

# Con zona horaria
gcal events create "Llamada de conferencia" --start "2024-01-15T14:00:00-08:00"
```

### Eventos de todo el día
Usa formato solo de fecha (YYYY-MM-DD):
```bash
gcal events create "Conferencia" --start "2024-01-15" --all-day
```

### Duración vs hora de fin
- Usa `--duration` en minutos para conveniencia
- Usa `--end` para una hora de fin específica
- No puedes especificar tanto `--end` como `--duration`

## Ejemplos

### Creación básica de eventos

```bash
# Reunión simple de 1 hora (duración por defecto)
gcal events create "Reunión de equipo" --start "2024-01-15T14:00:00"

# Reunión con duración específica
gcal events create "Stand-up matutino" --start "2024-01-15T09:00:00" --duration 30

# Reunión con hora de fin específica
gcal events create "Revisión de proyecto" --start "2024-01-15T14:00:00" --end "2024-01-15T16:00:00"
```

### Eventos de todo el día

```bash
# Evento de un solo día
gcal events create "Conferencia" --start "2024-01-15" --all-day

# Evento de múltiples días (la fecha de fin es exclusiva)
gcal events create "Vacaciones" --start "2024-01-15" --end "2024-01-20" --all-day
```

### Eventos con metadatos

```bash
# Reunión con ubicación
gcal events create "Reunión con cliente" \
  --start "2024-01-15T14:00:00" \
  --duration 90 \
  --location "Sala de conferencias A"

# Evento con descripción
gcal events create "Planificación del sprint" \
  --start "2024-01-15T10:00:00" \
  --duration 120 \
  --description "Planificación de tareas para el próximo sprint"
```

### Eventos con asistentes

```bash
# Agregar asistentes sin enviar invitaciones
gcal events create "Sincronización del equipo" \
  --start "2024-01-15T14:00:00" \
  --attendees "alice@company.com,bob@company.com"

# Enviar invitaciones a asistentes
gcal events create "Reunión importante" \
  --start "2024-01-15T14:00:00" \
  --attendees "alice@company.com,bob@company.com" \
  --send-updates all
```

### Calendarios diferentes

```bash
# Crear en calendario de trabajo
gcal events create "Demo del sprint" \
  --start "2024-01-15T15:00:00" \
  --calendar work@company.com

# Crear en calendario personal
gcal events create "Cita médica" \
  --start "2024-01-15T10:00:00" \
  --calendar personal@gmail.com
```

### Ejemplos avanzados

```bash
# Configuración completa de reunión
gcal events create "Revisión trimestral" \
  --start "2024-01-15T14:00:00" \
  --end "2024-01-15T17:00:00" \
  --location "Sala de conferencias principal" \
  --description "Resultados del Q4 y planificación del Q1" \
  --attendees "team@company.com,manager@company.com" \
  --calendar work@company.com \
  --send-updates all

# Salida JSON para scripts
gcal events create "Evento automatizado" \
  --start "2024-01-15T14:00:00" \
  --format json --quiet
```

## Formatos de salida

**Formato tabla (por defecto):**
```
¡Evento creado exitosamente!

Título: Reunión de equipo
ID: abc123def456
Inicio: 15/1/2024 14:00:00
Fin: 15/1/2024 15:00:00
Ubicación: Sala de conferencias A
Enlace de Google Calendar: https://calendar.google.com/event?eid=...
```

**Formato JSON:**
```json
{
  "id": "abc123def456",
  "summary": "Reunión de equipo",
  "start": {
    "dateTime": "2024-01-15T14:00:00-08:00"
  },
  "end": {
    "dateTime": "2024-01-15T15:00:00-08:00"
  },
  "location": "Sala de conferencias A",
  "htmlLink": "https://calendar.google.com/event?eid=..."
}
```

## Gestión de asistentes

### Opciones de invitación
- `none` (por defecto) - Agregar asistentes pero no enviar invitaciones
- `all` - Enviar invitaciones a todos los asistentes
- `externalOnly` - Enviar invitaciones solo a asistentes externos

### Formato de asistentes
Proporciona direcciones de correo separadas por comas:
```bash
--attendees "alice@company.com,bob@external.com,charlie@company.com"
```

## Manejo de zonas horarias

- **Hora local**: Si no se especifica zona horaria, se usa la zona horaria local
- **Zona horaria explícita**: Incluye desplazamiento de zona horaria en formato ISO
- **Eventos de todo el día**: Formato solo de fecha, independiente de zona horaria

## Validación y manejo de errores

### Errores comunes
- **Formato de fecha inválido**: Verifica formato ISO 8601 para eventos con hora
- **Especificar tanto end como duration**: No puedes especificar tanto `--end` como `--duration`
- **Duración inválida**: Debe ser un entero positivo (minutos)
- **Fechas en el pasado**: Se muestra advertencia pero el evento se crea

### Ejemplos de formatos de fecha
```bash
# Formatos válidos
--start "2024-01-15T14:00:00"           # Zona horaria local
--start "2024-01-15T14:00:00-08:00"     # Hora del Pacífico
--start "2024-01-15T22:00:00Z"          # UTC
--start "2024-01-15" --all-day          # Evento de todo el día

# Formatos inválidos
--start "15 de enero de 2024"           # Usar formato ISO
--start "14:00"                         # Falta la fecha
```

## Casos de uso

- **Programación de reuniones** - Crear reuniones con asistentes y ubicaciones
- **Planificación de eventos** - Configurar conferencias, talleres, eventos sociales
- **Recordatorios personales** - Crear citas y eventos personales
- **Configuración de recurrencias** - Crear eventos plantilla para repetición manual
- **Automatización** - Scripts para crear eventos desde sistemas externos

## Comandos relacionados

- [`gcal events list`](events-list.md) - Ver eventos creados
- [`gcal events show`](events-show.md) - Obtener información detallada del evento
- [`gcal calendars list`](calendars-list.md) - Buscar IDs de calendarios disponibles
- [`gcal config`](config.md) - Configurar ajustes por defecto