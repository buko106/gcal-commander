# gcal calendars list

Lista todos os calendários acessíveis através da sua conta Google.

## Uso

```bash
gcal calendars list [opções]
```

## Opções

| Flag | Abrev. | Descrição | Padrão |
|------|--------|-----------|---------|
| `--fields` | | Lista separada por vírgulas de campos a exibir em formato de tabela | Todos os campos |
| `--format` | `-f` | Formato de saída (table, json, pretty-json) | `table` |
| `--quiet` | `-q` | Ocultar saída não essencial (mensagens de status, indicadores de progresso) | `false` |

## Exemplos

### Uso básico

```bash
# Listar todos os calendários em formato de tabela
gcal calendars list

# Listar calendários em formato JSON
gcal calendars list --format json

# Listar calendários silenciosamente (sem mensagens de status)
gcal calendars list --quiet

# Mostrar apenas nomes de calendários e IDs
gcal calendars list --fields name,id

# Mostrar apenas nomes (para visão geral rápida)
gcal calendars list --fields name
```

### Formatos de saída

**Formato de tabela (padrão):**
```
Calendários disponíveis (3 encontrados):

1. João Silva (Principal)
   ID: primary
   Acesso: owner

2. Calendário de Trabalho
   ID: work@company.com
   Acesso: owner

3. Eventos da Família
   ID: family@gmail.com
   Acesso: reader
```

**Formato JSON:**
```json
[
  {
    "id": "primary",
    "summary": "João Silva",
    "primary": true,
    "accessRole": "owner"
  },
  {
    "id": "work@company.com",
    "summary": "Calendário de Trabalho",
    "accessRole": "owner"
  }
]
```

## Personalização de campos de tabela

Você pode personalizar quais colunas são exibidas em formato de tabela usando a flag `--fields`:

### Campos disponíveis
- `name` - Nome/resumo do calendário
- `id` - ID do calendário
- `access` - Papel de acesso (owner, reader, writer, etc.)
- `primary` - Indicador de calendário principal
- `description` - Descrição do calendário
- `color` - Cor do calendário

### Exemplos
```bash
# Mostrar apenas nome e ID (caso de uso mais comum)
gcal calendars list --fields name,id

# Mostrar nome, ID e papel de acesso
gcal calendars list --fields name,id,access

# Mostrar apenas nomes para visão geral rápida
gcal calendars list --fields name

# Mostrar cores de calendários e acesso
gcal calendars list --fields name,color,access
```

**Nota**: A flag `--fields` afeta apenas a saída em formato de tabela. A saída JSON sempre inclui todos os campos disponíveis.

## Casos de uso

- **Descoberta de calendários** - Ver todos os calendários aos quais você tem acesso
- **Busca de IDs de calendários** - Obter IDs exatos de calendários para usar em outros comandos
- **Scripting** - Analisar dados de calendários programaticamente com `--format json`
- **Visão geral rápida** - Verificar calendários disponíveis antes de listar eventos

## Integração com outros comandos

Os IDs de calendários retornados por este comando podem ser usados em:

- [`gcal events list <calendar-id>`](events-list.md) - Listar eventos de um calendário específico
- [`gcal events show <event-id> --calendar <calendar-id>`](events-show.md) - Mostrar detalhes de eventos de um calendário específico
- [`gcal config set defaultCalendar <calendar-id>`](config.md) - Definir calendário padrão

## Comandos relacionados

- [`gcal events list`](events-list.md) - Listar eventos de calendários
- [`gcal config`](config.md) - Configurar definições padrão do calendário