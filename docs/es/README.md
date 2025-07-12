gcal-commander
=================

Una interfaz de línea de comandos para operaciones de Google Calendar. Gestiona eventos y calendarios de Google Calendar directamente desde la terminal.

> 🤖 Este proyecto está desarrollado principalmente usando [Claude Code](https://claude.ai/code), demostrando las capacidades de desarrollo asistido por IA.


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/gcal-commander.svg)](https://npmjs.org/package/gcal-commander)
[![Downloads/week](https://img.shields.io/npm/dw/gcal-commander.svg)](https://npmjs.org/package/gcal-commander)
[![codecov](https://codecov.io/github/buko106/gcal-commander/graph/badge.svg?token=DQUL68E057)](https://codecov.io/github/buko106/gcal-commander)

## Características

- 📅 **Leer eventos de Google Calendar** - Listar y ver información detallada de eventos
- ✏️ **Crear eventos de calendario** - Agregar nuevos eventos con opciones flexibles de tiempo, asistentes y ubicaciones
- 📋 **Gestionar múltiples calendarios** - Accede a todos tus calendarios de Google
- 🔐 **Autenticación OAuth2 segura** - Configuración única con actualización automática de tokens
- 💻 **Salida amigable para terminal** - Formato de tabla limpio o JSON para scripting
- 🔇 **Soporte para modo silencioso** - Usa la bandera `--quiet` para suprimir mensajes de estado en scripts
- 🚀 **Rápido y ligero** - Construido con el framework oclif

## Idiomas

📖 **README en otros idiomas:**
- [🇺🇸 English](../../README.md)
- [🇯🇵 日本語 (Japanese)](../ja/README.md)

## Instalación

```bash
npm install -g gcal-commander
```

## Configuración Inicial

Antes de usar gcal-commander, necesitas configurar el acceso a la API de Google Calendar:

### 1. Configuración de Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google Calendar:
   - Navega a "APIs y Servicios" > "Biblioteca"
   - Busca "Google Calendar API"
   - Haz clic en ella y presiona "Habilitar"

### 2. Crear Credenciales OAuth 2.0

1. Ve a "APIs y Servicios" > "Credenciales"
2. Haz clic en "Crear Credenciales" > "ID de cliente OAuth"
3. Si se te solicita, configura la pantalla de consentimiento OAuth:
   - Elige el tipo de usuario "Externo"
   - Completa los campos requeridos (Nombre de la aplicación, Email de soporte al usuario, Contacto del desarrollador)
   - Agrega tu email a los usuarios de prueba
4. Para el tipo de aplicación, selecciona "Aplicación de escritorio"
5. Dale un nombre (ej. "gcal-commander")
6. Haz clic en "Crear"
7. Descarga el archivo JSON de credenciales

### 3. Configurar Archivo de Credenciales

Coloca el archivo de credenciales descargado en el directorio de configuración de gcal-commander:

```bash
# Crear el directorio de configuración
mkdir -p ~/.gcal-commander

# Copiar tu archivo de credenciales descargado
cp ~/Downloads/client_secret_*.json ~/.gcal-commander/credentials.json
```

### 4. Autenticación en la Primera Ejecución

Cuando ejecutes gcal-commander por primera vez, hará lo siguiente:

1. Abrirá tu navegador predeterminado para la autenticación OAuth de Google
2. Te pedirá que inicies sesión en tu cuenta de Google
3. Solicitará permiso para acceder a tu Google Calendar
4. Guardará el token de autenticación automáticamente

```bash
# Primera ejecución - esto activará el flujo de autenticación
gcal calendars list
```

El token de autenticación se guardará en `~/.gcal-commander/token.json` y se actualizará automáticamente cuando sea necesario.

## Uso Básico

```bash
# Listar todos tus calendarios
gcal calendars list

# Listar próximos eventos de tu calendario principal
gcal events list

# Listar eventos de un calendario específico
gcal events list my-calendar@gmail.com

# Mostrar información detallada sobre un evento
gcal events show <event-id>

# Crear un nuevo evento
gcal events create "Reunión de Equipo" --start "2024-01-15T14:00:00" --duration 60

# Crear un evento de todo el día
gcal events create "Conferencia" --start "2024-01-15" --all-day

# Limitar número de eventos y rango de tiempo
gcal events list --max-results 5 --days 7

# Usar modo silencioso para scripting (suprime mensajes de estado)
gcal events list --quiet --format json | jq '.[] | .summary'

# Ejemplos de configuración
gcal config set defaultCalendar work@company.com
gcal events list  # Ahora usa work@company.com como predeterminado
```

## Configuración

gcal-commander soporta configuración global para personalizar el comportamiento predeterminado:

```bash
# Establecer calendario predeterminado para la lista de eventos
gcal config set defaultCalendar work@company.com

# Establecer número predeterminado de eventos a mostrar
gcal config set events.maxResults 25

# Establecer formato de salida predeterminado
gcal config set events.format json

# Establecer rango de tiempo predeterminado (días)
gcal config set events.days 60

# Ver toda la configuración actual
gcal config list

# Ver valor de configuración específico
gcal config get defaultCalendar

# Eliminar una configuración
gcal config unset defaultCalendar

# Restablecer toda la configuración
gcal config reset --confirm
```

### Opciones de Configuración

- `defaultCalendar` - ID de calendario predeterminado para `gcal events list` (predeterminado: "primary")
- `events.maxResults` - Número máximo predeterminado de eventos (1-100, predeterminado: 10)
- `events.format` - Formato de salida predeterminado: "table", "json", o "pretty-json" (predeterminado: "table")
- `events.days` - Número predeterminado de días a mirar hacia adelante (1-365, predeterminado: 30)
- `language` - Idioma de la interfaz: "en", "ja", "es", "de", "pt", "fr", o "ko" (predeterminado: "en")

La configuración se almacena en `~/.gcal-commander/config.json` y puede editarse manualmente.

## Comandos

gcal-commander proporciona varios comandos para interactuar con Google Calendar:

### Gestión de Calendarios
- **[`gcal calendars list`](calendars-list.md)** - Listar todos los calendarios disponibles

### Gestión de Eventos  
- **[`gcal events list`](events-list.md)** - Listar próximos eventos del calendario
- **[`gcal events show`](events-show.md)** - Mostrar información detallada del evento
- **[`gcal events create`](events-create.md)** - Crear nuevos eventos de calendario con opciones flexibles de programación

### Configuración
- **[`gcal config`](config.md)** - Gestionar configuraciones globales

### Configuración y Autenticación
- **[`gcal init`](init.md)** - Verificar la configuración de autenticación de Google Calendar

### Ayuda
- **`gcal help`** - Mostrar ayuda para cualquier comando

Para ejemplos de uso detallados y opciones para cada comando, haz clic en los enlaces de arriba para ver la documentación completa.

## Contribuir

¡Damos la bienvenida a las contribuciones a gcal-commander! Este proyecto abraza el desarrollo asistido por IA.

### Flujo de Trabajo de Desarrollo Recomendado

- **Usa [Claude Code](https://claude.ai/code)** para asistencia en desarrollo - desde implementar características hasta revisiones de código
- **Aseguramiento de Calidad**: Haz que Claude Code revise tus cambios para calidad de código, mejores prácticas y consistencia
- **Pruebas**: Asegúrate de que todas las pruebas pasen con `npm test`
- **Linting**: El código se lint y formatea automáticamente a través de hooks pre-commit

### Configuración de Desarrollo

1. Haz fork y clona el repositorio
2. Instala dependencias: `npm install`
3. **Flujo de trabajo de desarrollo**:
   - **Para desarrollo activo**: Usa `./bin/dev.js COMMAND` para ejecutar comandos directamente desde archivos fuente TypeScript (no requiere build)
   - **Para pruebas finales**: Usa `npm run build && ./bin/run.js COMMAND` para probar el build de producción
4. Haz tus cambios y ejecuta pruebas: `npm test`
5. Envía un pull request

**Modos de Ejecución CLI:**
- `./bin/dev.js` - Modo desarrollo (archivos fuente TypeScript con ts-node, cambios instantáneos)
- `./bin/run.js` - Modo producción (JavaScript compilado desde dist/, requiere build)

El proyecto usa Husky + lint-staged para verificaciones automáticas de calidad de código antes de commits.

## Soporte de Idiomas

gcal-commander soporta internacionalización (i18n) y está disponible en múltiples idiomas:

**Idiomas Soportados:**
- **English** (`en`) - Predeterminado
- **Japanese** (`ja`) - 日本語  
- **Spanish** (`es`) - Español
- **German** (`de`) - Deutsch
- **Portuguese** (`pt`) - Português
- **French** (`fr`) - Français
- **Korean** (`ko`) - 한국어

```bash
# Cambiar a japonés
gcal config set language ja

# Cambiar a español
gcal config set language es

# Cambiar a alemán
gcal config set language de

# Cambiar a portugués
gcal config set language pt

# Cambiar a francés
gcal config set language fr

# Cambiar a coreano
gcal config set language ko

# Volver a inglés  
gcal config set language en

# Ver configuración de idioma actual
gcal config get language
```

Todos los mensajes de salida de comandos, mensajes de error y mensajes de estado se mostrarán en el idioma seleccionado.