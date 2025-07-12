# gcal events create

Cria novos eventos de calendário com opções flexíveis de agendamento, participantes e metadados.

## Uso

```bash
gcal events create <resumo> [opções]
```

## Argumentos

| Argumento | Descrição | Obrigatório |
|-----------|-----------|-------------|
| `resumo` | Título/resumo do evento | Sim |

## Opções

| Flag | Abrev. | Descrição | Padrão |
|------|--------|-----------|---------|
| `--start` | `-s` | Data e hora de início (formato ISO) | Obrigatório |
| `--end` | `-e` | Data e hora de fim (formato ISO) | - |
| `--duration` | `-d` | Duração em minutos (alternativa ao --end) | `60` |
| `--all-day` | | Criar evento de dia inteiro | `false` |
| `--calendar` | `-c` | ID do calendário onde criar o evento | `primary` |
| `--location` | `-l` | Local do evento | - |
| `--description` | | Descrição do evento | - |
| `--attendees` | | Lista separada por vírgulas de endereços de e-mail dos participantes | - |
| `--send-updates` | | Enviar convites do evento (all/externalOnly/none) | `none` |
| `--format` | `-f` | Formato de saída (table, json, pretty-json) | `table` |
| `--quiet` | `-q` | Ocultar saída não essencial (mensagens de status, indicadores de progresso) | `false` |

## Especificação de tempo

### Eventos com horário
Use o formato ISO 8601 para datas e horários:
```bash
# Formato básico
gcal events create "Reunião" --start "2024-01-15T14:00:00"

# Com fuso horário
gcal events create "Teleconferência" --start "2024-01-15T14:00:00-08:00"
```

### Eventos de dia inteiro
Use formato apenas de data (YYYY-MM-DD):
```bash
gcal events create "Conferência" --start "2024-01-15" --all-day
```

### Duração vs. hora de fim
- Use `--duration` em minutos para conveniência
- Use `--end` para um horário de fim específico
- Você não pode especificar tanto `--end` quanto `--duration`

## Exemplos

### Criação básica de eventos

```bash
# Reunião simples de 1 hora (duração padrão)
gcal events create "Reunião da equipe" --start "2024-01-15T14:00:00"

# Reunião com duração específica
gcal events create "Stand-up matinal" --start "2024-01-15T09:00:00" --duration 30

# Reunião com horário de fim específico
gcal events create "Revisão do projeto" --start "2024-01-15T14:00:00" --end "2024-01-15T16:00:00"
```

### Eventos de dia inteiro

```bash
# Evento de um dia
gcal events create "Conferência" --start "2024-01-15" --all-day

# Evento de múltiplos dias (data de fim é exclusiva)
gcal events create "Férias" --start "2024-01-15" --end "2024-01-20" --all-day
```

### Eventos com metadados

```bash
# Reunião com local
gcal events create "Reunião com cliente" \
  --start "2024-01-15T14:00:00" \
  --duration 90 \
  --location "Sala de conferências A"

# Evento com descrição
gcal events create "Planejamento da sprint" \
  --start "2024-01-15T10:00:00" \
  --duration 120 \
  --description "Planejamento de tarefas para a próxima sprint"
```

### Eventos com participantes

```bash
# Adicionar participantes sem enviar convites
gcal events create "Sincronização da equipe" \
  --start "2024-01-15T14:00:00" \
  --attendees "alice@company.com,bob@company.com"

# Enviar convites para participantes
gcal events create "Reunião importante" \
  --start "2024-01-15T14:00:00" \
  --attendees "alice@company.com,bob@company.com" \
  --send-updates all
```

### Calendários diferentes

```bash
# Criar no calendário de trabalho
gcal events create "Demo da sprint" \
  --start "2024-01-15T15:00:00" \
  --calendar work@company.com

# Criar no calendário pessoal
gcal events create "Consulta médica" \
  --start "2024-01-15T10:00:00" \
  --calendar personal@gmail.com
```

### Exemplos avançados

```bash
# Configuração completa de reunião
gcal events create "Revisão trimestral" \
  --start "2024-01-15T14:00:00" \
  --end "2024-01-15T17:00:00" \
  --location "Sala de conferências principal" \
  --description "Resultados do Q4 e planejamento do Q1" \
  --attendees "team@company.com,manager@company.com" \
  --calendar work@company.com \
  --send-updates all

# Saída JSON para scripts
gcal events create "Evento automatizado" \
  --start "2024-01-15T14:00:00" \
  --format json --quiet
```

## Formatos de saída

**Formato de tabela (padrão):**
```
Evento criado com sucesso!

Título: Reunião da equipe
ID: abc123def456
Início: 15/1/2024 14:00:00
Fim: 15/1/2024 15:00:00
Local: Sala de conferências A
Link do Google Calendar: https://calendar.google.com/event?eid=...
```

**Formato JSON:**
```json
{
  "id": "abc123def456",
  "summary": "Reunião da equipe",
  "start": {
    "dateTime": "2024-01-15T14:00:00-08:00"
  },
  "end": {
    "dateTime": "2024-01-15T15:00:00-08:00"
  },
  "location": "Sala de conferências A",
  "htmlLink": "https://calendar.google.com/event?eid=..."
}
```

## Gerenciamento de participantes

### Opções de convite
- `none` (padrão) - Adicionar participantes mas não enviar convites
- `all` - Enviar convites para todos os participantes
- `externalOnly` - Enviar convites apenas para participantes externos

### Formato de participantes
Forneça endereços de e-mail separados por vírgulas:
```bash
--attendees "alice@company.com,bob@external.com,charlie@company.com"
```

## Tratamento de fuso horário

- **Hora local**: Se nenhum fuso horário for especificado, usa o fuso horário local
- **Fuso horário explícito**: Inclua offset de fuso horário no formato ISO
- **Eventos de dia inteiro**: Formato apenas de data, independente de fuso horário

## Validação e tratamento de erros

### Erros comuns
- **Formato de data inválido**: Verifique o formato ISO 8601 para eventos com horário
- **Especificar tanto end quanto duration**: Você não pode especificar tanto `--end` quanto `--duration`
- **Duração inválida**: Deve ser um inteiro positivo (minutos)
- **Datas no passado**: Aviso é mostrado mas o evento é criado

### Exemplos de formatos de data
```bash
# Formatos válidos
--start "2024-01-15T14:00:00"           # Fuso horário local
--start "2024-01-15T14:00:00-08:00"     # Hora do Pacífico
--start "2024-01-15T22:00:00Z"          # UTC
--start "2024-01-15" --all-day          # Evento de dia inteiro

# Formatos inválidos
--start "15 de janeiro de 2024"         # Use formato ISO
--start "14:00"                         # Data está faltando
```

## Casos de uso

- **Agendamento de reuniões** - Criar reuniões com participantes e locais
- **Planejamento de eventos** - Configurar conferências, workshops, eventos sociais
- **Lembretes pessoais** - Criar compromissos e eventos pessoais
- **Configuração de recorrência** - Criar eventos modelo para repetição manual
- **Automação** - Scripts para criar eventos de sistemas externos

## Comandos relacionados

- [`gcal events list`](events-list.md) - Ver eventos criados
- [`gcal events show`](events-show.md) - Obter informações detalhadas do evento
- [`gcal calendars list`](calendars-list.md) - Encontrar IDs de calendários disponíveis
- [`gcal config`](config.md) - Configurar definições padrão