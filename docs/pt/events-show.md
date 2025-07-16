# gcal events show

Mostra informações detalhadas de um evento de calendário específico.

## Uso

```bash
gcal events show <event-id> [opções]
```

## Argumentos

| Argumento | Descrição | Obrigatório |
|-----------|-----------|-------------|
| `event-id` | ID do evento para mostrar detalhes | Sim |

## Opções

| Flag | Abrev. | Descrição | Padrão |
|------|--------|-----------|---------|
| `--calendar` | `-c` | ID do calendário onde o evento existe | `primary` |
| `--fields` | | Lista separada por vírgulas de campos a exibir em formato de tabela | Todos os campos |
| `--format` | `-f` | Formato de saída (table, json, pretty-json) | `table` |
| `--quiet` | `-q` | Ocultar saída não essencial (mensagens de status, indicadores de progresso) | `false` |

## Exemplos

### Uso básico

```bash
# Mostrar detalhes do evento do calendário principal
gcal events show abc123def456

# Mostrar evento de um calendário específico
gcal events show abc123def456 --calendar work@company.com

# Obter detalhes do evento em formato JSON
gcal events show abc123def456 --format json
```

### Uso avançado

```bash
# Mostrar evento silenciosamente (para scripts)
gcal events show abc123def456 --quiet --format json

# Mostrar evento de calendário específico em formato JSON
gcal events show abc123def456 --calendar team@company.com --format json
```

## Obtendo IDs de eventos

IDs de eventos podem ser obtidos de:

1. **Saída do comando `gcal events list`**
2. **URLs do Google Calendar** (a string longa na URL)
3. **Respostas da API do Calendar** (ao usar formato JSON)

Exemplo para encontrar IDs de eventos:
```bash
# Buscar IDs na listagem de eventos
gcal events list --format json | jq '.[] | {id, summary}'
```

## Formatos de saída

**Formato de tabela (padrão):**
```
=== Detalhes do evento ===

Título: Reunião da equipe
ID: abc123def456
Descrição: Reunião semanal de sincronização da equipe
Local: Sala de conferências A
Status: confirmed
Início: 15 de janeiro de 2024 (seg) • 9:00
Fim: 15 de janeiro de 2024 (seg) • 10:00
Criador: João Silva
Organizador: Maria Santos

Participantes:
  1. joao@company.com (accepted)
  2. maria@company.com (tentative)

Link do Google Calendar: https://calendar.google.com/event?eid=...
Criado: 10/1/2024 8:30:00
Última atualização: 12/1/2024 15:45:00
```

**Formato JSON:**
```json
{
  "id": "abc123def456",
  "summary": "Reunião da equipe",
  "description": "Reunião semanal de sincronização da equipe",
  "start": {
    "dateTime": "2024-01-15T09:00:00-08:00",
    "timeZone": "America/Los_Angeles"
  },
  "end": {
    "dateTime": "2024-01-15T10:00:00-08:00",
    "timeZone": "America/Los_Angeles"
  },
  "location": "Sala de conferências A",
  "attendees": [
    {
      "email": "joao@company.com",
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

## Detalhes do evento mostrados

Este comando mostra informações abrangentes do evento incluindo:

- **Informações básicas**: Título, descrição, ID do evento
- **Informações de tempo**: Horários de início/fim com informações de fuso horário
- **Local**: Local físico ou de reunião virtual
- **Participantes**: Endereços de e-mail e status de resposta
- **Status**: Status do evento (confirmed, tentative, cancelled)
- **Metadados**: Timestamps de criação e última atualização
- **Recorrência**: Regras de recorrência (se aplicável)
- **Lembretes**: Lembretes padrão e personalizados

## Casos de uso comuns

### Verificação de eventos
```bash
# Verificar rapidamente detalhes do evento antes de uma reunião
gcal events show $(gcal events list --format json | jq -r '.[0].id')
```

### Informações de participantes
```bash
# Extrair endereços de e-mail dos participantes do evento
gcal events show abc123 --format json | jq -r '.attendees[]?.email'
```

### Verificação de reserva de sala
```bash
# Verificar detalhes de local e horário
gcal events show abc123 | grep -E "(Local|Início|Fim)"
```

### Exportação de dados do evento
```bash
# Obter dados completos do evento para processamento externo
gcal events show abc123 --format json --quiet > event-details.json
```

## Tratamento de erros

Erros comuns e soluções:

- **Evento não encontrado**: Verificar ID do evento e calendário
- **Acesso negado**: Verificar permissões de acesso ao calendário especificado
- **ID de evento inválido**: Verificar formato do ID do evento e fonte

## Comandos relacionados

- [`gcal events list`](events-list.md) - Encontrar IDs de eventos para usar com este comando
- [`gcal calendars list`](calendars-list.md) - Encontrar IDs de calendários disponíveis
- [`gcal config`](config.md) - Configurar definições padrão