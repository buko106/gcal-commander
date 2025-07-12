# gcal init

Verifica la configuración de autenticación de Google Calendar y prueba la conectividad con la API de Google Calendar.

## Uso

```bash
gcal init [opciones]
```

## Opciones

| Bandera | Abrev. | Descripción | Por defecto |
|---------|--------|-------------|-------------|
| `--format` | `-f` | Formato de salida (table, json, pretty-json) | `table` |
| `--quiet` | `-q` | Ocultar salida no esencial (mensajes de estado, indicadores de progreso) | `false` |

## Descripción

El comando `init` verifica que la autenticación de Google Calendar esté funcionando correctamente. Realiza una conexión de prueba a la API de Google Calendar para verificar:

- Los archivos de credenciales están configurados correctamente
- Los tokens de autenticación son válidos
- Tienes acceso a Google Calendar

Este comando es especialmente útil para:
- Configuración inicial de gcal-commander
- Solución de problemas de autenticación
- Verificación de configuración después de hacer cambios a las credenciales

## Ejemplos

### Uso básico

```bash
# Verificar autenticación con prompt de confirmación
gcal init

# Verificar autenticación silenciosamente (para scripts)
gcal init --quiet
```

## Flujo interactivo

Al ejecutar `gcal init`, verás un prompt de confirmación para la verificación de autenticación:

```
Esto verificará la autenticación de Google Calendar.
? ¿Verificar autenticación? (Y/n) 
```

- Presiona Enter o escribe `y` para continuar con la verificación
- Escribe `n` para cancelar la operación

**Nota**: El mensaje de estado inicial "Esto verificará la autenticación de Google Calendar." siempre se muestra, incluso cuando se usa la bandera `--quiet`. La bandera `--quiet` solo oculta el mensaje de progreso "Verificando autenticación de Google Calendar...".

## Salida exitosa

Cuando la autenticación es exitosa:

```
✓ Verificando autenticación de Google Calendar...
¡Autenticación exitosa!
```

## Manejo de errores

Si la autenticación falla, verás un mensaje de error con información para solución de problemas:

```
✗ Verificando autenticación de Google Calendar...
Error de autenticación: [detalles del error]
Reintenta el comando o verifica tus credenciales de la API de Google Calendar.
```

Errores comunes de autenticación:
- Archivo de credenciales faltante o inválido
- Tokens de autenticación expirados
- Permisos insuficientes
- Problemas de conectividad de red

## Prerrequisitos

Antes de ejecutar `gcal init`, asegúrate de tener:

1. **API de Google Calendar habilitada** - Habilitada en Google Cloud Console
2. **Credenciales OAuth 2.0** - Descargadas y ubicadas en `~/.gcal-commander/credentials.json`
3. **Acceso a la red** - Acceso a las APIs de Google

Si aún no has configurado la autenticación, sigue la guía de [Configuración inicial](../README.md#configuración-inicial) en el README.

## Solución de problemas

### Error de autenticación

Si `gcal init` falla:

1. **Verificar archivo de credenciales**: Asegúrate de que `~/.gcal-commander/credentials.json` existe y contiene credenciales OAuth 2.0 válidas
2. **Regenerar token**: Elimina `~/.gcal-commander/token.json` y ejecuta cualquier comando gcal para reautenticarte
3. **Verificar acceso a la API**: Confirma que la API de Google Calendar está habilitada en Google Cloud Console
4. **Verificar red**: Asegúrate de tener acceso a internet y puedes alcanzar los servidores de Google

### Permisos de archivos

Si encuentras errores de permisos:

```bash
# Verificar permisos de archivos
ls -la ~/.gcal-commander/

# Corregir permisos si es necesario
chmod 600 ~/.gcal-commander/credentials.json
chmod 600 ~/.gcal-commander/token.json
```

## Casos de uso

- **Verificación de configuración inicial** - Confirmar que la autenticación funciona después de la configuración
- **Solución de problemas** - Diagnosticar problemas de autenticación
- **Integración CI/CD** - Verificar autenticación en entornos automatizados
- **Verificación de salud** - Verificar periódicamente que la autenticación sigue siendo válida

## Comandos relacionados

- [`gcal calendars list`](calendars-list.md) - Listar calendarios disponibles (también prueba autenticación)
- [`gcal events list`](events-list.md) - Listar eventos (requiere autenticación)
- [`gcal config`](config.md) - Gestionar configuración

## Referencias

- [Guía de configuración inicial](../README.md#configuración-inicial) - Pasos completos de configuración
- [Configuración de la API de Google Calendar](https://console.cloud.google.com/) - Google Cloud Console