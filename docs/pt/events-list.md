# gcal events list

Lista próximos eventos de calendário do calendário especificado ou padrão.

## Uso

```bash
gcal events list [calendário] [opções]
```

## Argumentos

| Argumento | Descrição | Padrão |
|-----------|-----------|---------|
| `calendário` | ID do calendário do qual listar eventos | `primary` |

## Opções

| Flag | Abrev. | Descrição | Padrão |
|------|--------|-----------|---------|
| `--days` | `-d` | Número de dias para buscar no futuro (1-365) | `30` |
| `--fields` | | Lista separada por vírgulas de campos a exibir em formato de tabela | Todos os campos |
| `--format` | `-f` | Formato de saída (table, json, pretty-json) | `table` |
| `--max-results` | `-n` | Número máximo de eventos a retornar (1-100) | `10` |
| `--quiet` | `-q` | Ocultar saída não essencial (mensagens de status, indicadores de progresso) | `false` |

## Suporte a configuração

Este comando suporta padrões de configuração global:

- `defaultCalendar` - Calendário padrão a usar se nenhum for especificado
- `events.days` - Número padrão de dias para buscar no futuro
- `events.format` - Formato de saída padrão
- `events.maxResults` - Número máximo padrão de eventos

Veja [`gcal config`](config.md) para detalhes sobre como definir esses valores.

## Exemplos

### Uso básico

```bash
# Listar eventos do calendário principal
gcal events list

# Listar eventos de um calendário específico
gcal events list work@company.com

# Listar eventos para os próximos 7 dias
gcal events list --days 7

# Listar até 20 eventos
gcal events list --max-results 20
```

### Uso avançado

```bash
# Combinar múltiplas opções
gcal events list personal@gmail.com --days 14 --max-results 5 --format json

# Modo silencioso para scripts
gcal events list --quiet --format json | jq '.[] | .summary'

# Usar valores padrão configurados
gcal config set defaultCalendar work@company.com
gcal config set events.days 14
gcal events list  # Usa work@company.com por 14 dias

# Personalizar colunas de tabela
gcal events list --fields title,date,time
gcal events list --fields title,location --max-results 20
```

### Formatos de saída

**Formato de tabela (padrão):**
```
Próximos eventos (2 encontrados):

1. Reunião da equipe
   15 de janeiro (seg) • 9:00 - 10:00
   Reunião semanal de sincronização da equipe

2. Revisão do projeto
   16 de janeiro (ter) • 14:00 - 15:30 @ Sala de conferências A
```

**Formato JSON:**
```json
[
  {
    "id": "abc123",
    "summary": "Reunião da equipe",
    "start": {
      "dateTime": "2024-01-15T09:00:00-08:00"
    },
    "end": {
      "dateTime": "2024-01-15T10:00:00-08:00"
    },
    "description": "Reunião semanal de sincronização da equipe"
  }
]
```

## Personalização de campos de tabela

Você pode personalizar quais colunas são exibidas em formato de tabela usando a flag `--fields`:

### Campos disponíveis
- `title` - Título/resumo do evento
- `date` - Data do evento
- `time` - Hora do evento
- `location` - Local do evento
- `description` - Descrição do evento

### Exemplos
```bash
# Mostrar apenas título e data
gcal events list --fields title,date

# Mostrar título, hora e local
gcal events list --fields title,time,location

# Mostrar apenas títulos (para visão geral rápida)
gcal events list --fields title
```

**Nota**: A flag `--fields` afeta apenas a saída em formato de tabela. A saída JSON sempre inclui todos os campos disponíveis.

## Intervalos de tempo e limites

- **Intervalo de dias**: 1-365 dias a partir de hoje
- **Máximo de resultados**: 1-100 eventos por solicitação
- **Fuso horário**: Eventos são mostrados no fuso horário local
- **Eventos passados**: Apenas eventos futuros/atuais são mostrados

## Scripting e automação

### Extrair títulos de eventos
```bash
gcal events list --format json --quiet | jq -r '.[].summary'
```

### Obter apenas eventos de hoje
```bash
gcal events list --days 1 --format json
```

### Contar próximos eventos
```bash
gcal events list --format json --quiet | jq 'length'
```

## Casos de uso

- **Planejamento diário** - Revisar próximos compromissos no seu calendário
- **Visão geral do calendário** - Verificação rápida de próximos eventos
- **Scripting** - Extrair dados de eventos para automação ou relatórios
- **Gerenciamento de múltiplos calendários** - Comparar eventos entre calendários diferentes

## Comandos relacionados

- [`gcal calendars list`](calendars-list.md) - Encontrar IDs de calendários disponíveis
- [`gcal events show`](events-show.md) - Obter informações detalhadas de eventos específicos
- [`gcal config`](config.md) - Definir valores padrão para este comando