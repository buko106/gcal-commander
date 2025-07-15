# gcal calendars list

Lista todos los calendarios accesibles a través de tu cuenta de Google.

## Uso

```bash
gcal calendars list [opciones]
```

## Opciones

| Bandera | Abrev. | Descripción | Por defecto |
|---------|--------|-------------|-------------|
| `--fields` | | Lista separada por comas de campos a mostrar en formato tabla | Todos los campos |
| `--format` | `-f` | Formato de salida (table, json, pretty-json) | `table` |
| `--quiet` | `-q` | Ocultar salida no esencial (mensajes de estado, indicadores de progreso) | `false` |

## Ejemplos

### Uso básico

```bash
# Listar todos los calendarios en formato tabla
gcal calendars list

# Listar calendarios en formato JSON
gcal calendars list --format json

# Listar calendarios silenciosamente (sin mensajes de estado)
gcal calendars list --quiet

# Mostrar solo nombres de calendarios e IDs
gcal calendars list --fields name,id

# Mostrar solo nombres (para vista rápida)
gcal calendars list --fields name
```

### Formatos de salida

**Formato tabla (por defecto):**
```
Calendarios disponibles (3 encontrados):

1. Carlos García (Principal)
   ID: primary
   Acceso: owner

2. Calendario de Trabajo
   ID: work@company.com
   Acceso: owner

3. Eventos Familiares
   ID: family@gmail.com
   Acceso: reader
```

**Formato JSON:**
```json
[
  {
    "id": "primary",
    "summary": "Carlos García",
    "primary": true,
    "accessRole": "owner"
  },
  {
    "id": "work@company.com",
    "summary": "Calendario de Trabajo",
    "accessRole": "owner"
  }
]
```

## Personalización de campos de tabla

Puedes personalizar qué columnas se muestran en formato tabla usando la bandera `--fields`:

### Campos disponibles
- `name` - Nombre/resumen del calendario
- `id` - ID del calendario
- `access` - Rol de acceso (owner, reader, writer, etc.)
- `primary` - Indicador de calendario principal
- `description` - Descripción del calendario
- `color` - Color del calendario

### Ejemplos
```bash
# Mostrar solo nombre e ID (caso de uso más común)
gcal calendars list --fields name,id

# Mostrar nombre, ID y rol de acceso
gcal calendars list --fields name,id,access

# Mostrar solo nombres para vista rápida
gcal calendars list --fields name

# Mostrar colores de calendarios y acceso
gcal calendars list --fields name,color,access
```

**Nota**: La bandera `--fields` solo afecta la salida en formato tabla. La salida JSON siempre incluye todos los campos disponibles.

## Casos de uso

- **Descubrimiento de calendarios** - Ver todos los calendarios a los que tienes acceso
- **Búsqueda de IDs de calendarios** - Obtener IDs exactos de calendarios para usar en otros comandos
- **Scripting** - Analizar datos de calendarios programáticamente con `--format json`
- **Resumen rápido** - Verificar calendarios disponibles antes de listar eventos

## Integración con otros comandos

Los IDs de calendarios devueltos por este comando pueden usarse en:

- [`gcal events list <calendar-id>`](events-list.md) - Listar eventos de un calendario específico
- [`gcal events show <event-id> --calendar <calendar-id>`](events-show.md) - Mostrar detalles de eventos de un calendario específico
- [`gcal config set defaultCalendar <calendar-id>`](config.md) - Establecer el calendario por defecto

## Comandos relacionados

- [`gcal events list`](events-list.md) - Listar eventos de calendarios
- [`gcal config`](config.md) - Configurar ajustes por defecto del calendario