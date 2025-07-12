# gcal config

Gerencia a configuração global do gcal-commander. Define valores padrão para comandos para personalizar sua experiência.

## Uso

```bash
gcal config <subcomando> [chave] [valor] [opções]
```

## Subcomandos

| Subcomando | Descrição |
|------------|-----------|
| `get <chave>` | Obter um valor de configuração |
| `set <chave> <valor>` | Definir um valor de configuração |
| `list` | Listar toda a configuração |
| `unset <chave>` | Remover uma configuração |
| `reset` | Redefinir toda a configuração para valores padrão |

## Opções

| Flag | Descrição |
|------|-----------|
| `--confirm` | Pular confirmação ao redefinir |
| `--format` | Formato de saída (table, json, pretty-json) |
| `--quiet` | Ocultar saída não essencial (mensagens de status, indicadores de progresso) |

## Chaves de configuração

### Configuração principal

| Chave | Descrição | Padrão | Valores válidos |
|-------|-----------|---------|-----------------|
| `defaultCalendar` | Calendário padrão para listar eventos | `primary` | Qualquer ID de calendário |
| `language` | Idioma da interface | `en` | `en`, `ja`, `es`, `de`, `pt`, `fr`, `ko` |

### Padrões para comandos de eventos

| Chave | Descrição | Padrão | Valores válidos |
|-------|-----------|---------|-----------------|
| `events.maxResults` | Número máximo padrão de eventos a retornar | `10` | `1-100` |
| `events.format` | Formato de saída padrão | `table` | `table`, `json`, `pretty-json` |
| `events.days` | Dias padrão para buscar no futuro | `30` | `1-365` |

## Exemplos

### Configuração básica

```bash
# Definir calendário padrão
gcal config set defaultCalendar work@company.com

# Obter o calendário padrão atual
gcal config get defaultCalendar

# Listar toda a configuração atual
gcal config list

# Remover uma configuração (voltar ao padrão)
gcal config unset defaultCalendar
```

### Configuração de idioma

```bash
# Mudar para português
gcal config set language pt

# Mudar para inglês
gcal config set language en

# Verificar configuração de idioma atual
gcal config get language
```

### Padrões para comandos de eventos

```bash
# Definir número padrão de eventos exibidos
gcal config set events.maxResults 25

# Definir período de tempo padrão
gcal config set events.days 60

# Definir formato de saída padrão
gcal config set events.format json

# Ver configurações de eventos
gcal config get events.maxResults
gcal config get events.days
gcal config get events.format
```

### Gerenciamento de configuração

```bash
# Mostrar toda a configuração em formato de tabela
gcal config list

# Mostrar toda a configuração em formato JSON
gcal config list --format json

# Redefinir toda a configuração (com confirmação)
gcal config reset

# Redefinir toda a configuração (pular confirmação)
gcal config reset --confirm
```

## Formatos de saída

### Comando list - Formato de tabela (padrão)
```
Chave                   Valor
────────────────────────────────────
defaultCalendar         work@company.com
language                pt
events.maxResults       25
events.format           json
events.days             60
```

### Comando list - Formato JSON
```json
{
  "defaultCalendar": "work@company.com",
  "language": "pt",
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

## Arquivo de configuração

A configuração é armazenada em `~/.gcal-commander/config.json`:

```json
{
  "defaultCalendar": "work@company.com",
  "language": "pt",
  "events": {
    "maxResults": 25,
    "format": "table",
    "days": 60
  }
}
```

Você pode editar este arquivo manualmente se necessário, mas é recomendado usar o comando config.

## Fluxos de trabalho comuns

### Configuração para trabalho
```bash
# Configuração para trabalho
gcal config set defaultCalendar work@company.com
gcal config set events.maxResults 20
gcal config set events.days 14
gcal config set events.format table
gcal config set language pt
```

### Configuração para scripts
```bash
# Configuração para automação/scripts
gcal config set events.format json
gcal config set events.maxResults 100
gcal config set language en
```

### Gerenciamento de múltiplos calendários
```bash
# Definir calendário de trabalho principal
gcal config set defaultCalendar primary-work@company.com

# Usar este calendário por padrão em listagens de eventos
gcal events list  # Usa primary-work@company.com

# Sobrescrever para consultas específicas
gcal events list personal@gmail.com
```

## Validação

Valores de configuração são validados ao serem definidos:

- **IDs de calendário**: Não validados até o primeiro uso
- **Intervalos numéricos**: `maxResults` (1-100), `days` (1-365)
- **Enumerações**: `format` deve ser "table", "json" ou "pretty-json"
- **Idioma**: `language` deve ser um de "en", "ja", "es", "de", "pt", "fr", "ko"
- **Valores inválidos**: Comando mostrará erro e opções válidas atuais

## Impacto nos comandos

A configuração afeta o comportamento padrão dos comandos:

### [`gcal events list`](events-list.md)
- Usa `defaultCalendar` se nenhum calendário for especificado
- Usa `events.maxResults` como padrão para `--max-results`
- Usa `events.format` como padrão para `--format`
- Usa `events.days` como padrão para `--days`

### [`gcal events show`](events-show.md)
- Usa `defaultCalendar` como padrão para `--calendar` se não especificado

### Todos os comandos
- Exibem mensagens baseadas na configuração `language`

Flags de linha de comando sempre sobrescrevem padrões de configuração.

## Solução de problemas

### Redefinir configuração
Se você tiver problemas com a configuração:
```bash
gcal config reset --confirm
```

### Ver configuração atual
```bash
gcal config list --format json
```

### Verificar configuração específica
```bash
gcal config get defaultCalendar
```

## Comandos relacionados

- [`gcal events list`](events-list.md) - Usa padrões de configuração
- [`gcal events show`](events-show.md) - Usa padrões de configuração
- [`gcal calendars list`](calendars-list.md) - Encontrar IDs de calendários para configuração