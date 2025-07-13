gcal-commander
=================

Uma interface de linha de comando para operações do Google Calendar. Gerencie eventos e calendários do Google Calendar diretamente do terminal.

> 🤖 Este projeto é desenvolvido principalmente usando [Claude Code](https://claude.ai/code), demonstrando as capacidades de desenvolvimento assistido por IA.


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/gcal-commander.svg)](https://npmjs.org/package/gcal-commander)
[![Downloads/week](https://img.shields.io/npm/dw/gcal-commander.svg)](https://npmjs.org/package/gcal-commander)
[![codecov](https://codecov.io/github/buko106/gcal-commander/graph/badge.svg?token=DQUL68E057)](https://codecov.io/github/buko106/gcal-commander)

## Recursos

- 📅 **Ler eventos do Google Calendar** - Listar e visualizar informações detalhadas de eventos
- ✏️ **Criar eventos de calendário** - Adicionar novos eventos com opções flexíveis de tempo, participantes e locais
- 📋 **Gerenciar múltiplos calendários** - Acesse todos os seus calendários do Google
- 🔐 **Autenticação OAuth2 segura** - Configuração única com atualização automática de token
- 💻 **Saída amigável ao terminal** - Formato de tabela limpo ou JSON para scripts
- 🔇 **Suporte ao modo silencioso** - Use a flag `--quiet` para suprimir mensagens de status em scripts
- 🚀 **Rápido e leve** - Construído com o framework oclif

## Idiomas

📖 **README em outros idiomas:**
- [🇺🇸 English](../../README.md)
- [🇯🇵 日本語 (Japanese)](../ja/README.md)
- [🇪🇸 Español (Spanish)](../es/README.md)
- [🇩🇪 Deutsch (German)](../de/README.md)

## Instalação

```bash
npm install -g gcal-commander
```

## Configuração Inicial

Antes de usar o gcal-commander, você precisa configurar o acesso à API do Google Calendar:

### 1. Configuração do Google Cloud Console

1. Vá para [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Habilite a API do Google Calendar:
   - Navegue para "APIs e Serviços" > "Biblioteca"
   - Pesquise por "Google Calendar API"
   - Clique nela e pressione "Habilitar"

### 2. Criar Credenciais OAuth 2.0

1. Vá para "APIs e Serviços" > "Credenciais"
2. Clique em "Criar Credenciais" > "ID do cliente OAuth"
3. Se solicitado, configure a tela de consentimento OAuth:
   - Escolha o tipo de usuário "Externo"
   - Preencha os campos obrigatórios (Nome da aplicação, Email de suporte ao usuário, Contato do desenvolvedor)
   - Adicione seu email aos usuários de teste
4. Para o tipo de aplicação, selecione "Aplicação para desktop"
5. Dê um nome (ex: "gcal-commander")
6. Clique em "Criar"
7. Baixe o arquivo JSON de credenciais

### 3. Configurar Arquivo de Credenciais

Coloque o arquivo de credenciais baixado no diretório de configuração do gcal-commander:

```bash
# Criar o diretório de configuração
mkdir -p ~/.gcal-commander

# Copiar seu arquivo de credenciais baixado
cp ~/Downloads/client_secret_*.json ~/.gcal-commander/credentials.json
```

### 4. Autenticação na Primeira Execução

Quando você executar o gcal-commander pela primeira vez, ele irá:

1. Abrir seu navegador padrão para autenticação OAuth do Google
2. Pedir para você fazer login na sua conta Google
3. Solicitar permissão para acessar seu Google Calendar
4. Salvar o token de autenticação automaticamente

```bash
# Primeira execução - isso disparará o fluxo de autenticação
gcal calendars list
```

O token de autenticação será salvo em `~/.gcal-commander/token.json` e atualizado automaticamente quando necessário.

## Uso Básico

```bash
# Listar todos os seus calendários
gcal calendars list

# Listar próximos eventos do seu calendário principal
gcal events list

# Listar eventos de um calendário específico
gcal events list my-calendar@gmail.com

# Mostrar informações detalhadas sobre um evento
gcal events show <event-id>

# Criar um novo evento
gcal events create "Reunião da Equipe" --start "2024-01-15T14:00:00" --duration 60

# Criar um evento de dia inteiro
gcal events create "Conferência" --start "2024-01-15" --all-day

# Limitar número de eventos e intervalo de tempo
gcal events list --max-results 5 --days 7

# Usar modo silencioso para scripts (suprime mensagens de status)
gcal events list --quiet --format json | jq '.[] | .summary'

# Exemplos de configuração
gcal config set defaultCalendar work@company.com
gcal events list  # Agora usa work@company.com como padrão
```

## Configuração

O gcal-commander suporta configuração global para personalizar o comportamento padrão:

```bash
# Definir calendário padrão para lista de eventos
gcal config set defaultCalendar work@company.com

# Definir número padrão de eventos para exibir
gcal config set events.maxResults 25

# Definir formato de saída padrão
gcal config set events.format json

# Definir intervalo de tempo padrão (dias)
gcal config set events.days 60

# Ver toda a configuração atual
gcal config list

# Ver valor de configuração específico
gcal config get defaultCalendar

# Remover uma configuração
gcal config unset defaultCalendar

# Resetar toda a configuração
gcal config reset --confirm
```

### Opções de Configuração

- `defaultCalendar` - ID do calendário padrão para `gcal events list` (padrão: "primary")
- `events.maxResults` - Número máximo padrão de eventos (1-100, padrão: 10)
- `events.format` - Formato de saída padrão: "table", "json", ou "pretty-json" (padrão: "table")
- `events.days` - Número padrão de dias para olhar adiante (1-365, padrão: 30)
- `language` - Idioma da interface: "en", "ja", "es", "de", "pt", "fr", ou "ko" (padrão: "en")

A configuração é armazenada em `~/.gcal-commander/config.json` e pode ser editada manualmente.

## Comandos

O gcal-commander fornece vários comandos para interagir com o Google Calendar:

### Gerenciamento de Calendários
- **[`gcal calendars list`](calendars-list.md)** - Listar todos os calendários disponíveis

### Gerenciamento de Eventos  
- **[`gcal events list`](events-list.md)** - Listar próximos eventos do calendário
- **[`gcal events show`](events-show.md)** - Mostrar informações detalhadas do evento
- **[`gcal events create`](events-create.md)** - Criar novos eventos de calendário com opções flexíveis de agendamento

### Configuração
- **[`gcal config`](config.md)** - Gerenciar configurações globais

### Configuração e Autenticação
- **[`gcal init`](init.md)** - Verificar configuração de autenticação do Google Calendar

### Ajuda
- **`gcal help`** - Exibir ajuda para qualquer comando

Para exemplos de uso detalhados e opções para cada comando, clique nos links acima para ver a documentação abrangente.

## Contribuindo

Recebemos contribuições para o gcal-commander! Este projeto abraça o desenvolvimento assistido por IA.

### Fluxo de Trabalho de Desenvolvimento Recomendado

- **Use [Claude Code](https://claude.ai/code)** para assistência no desenvolvimento - desde implementar recursos até revisões de código
- **Garantia de Qualidade**: Tenha o Claude Code revisando suas mudanças para qualidade de código, melhores práticas e consistência
- **Testes**: Certifique-se de que todos os testes passem com `npm test`
- **Linting**: Código é automaticamente lintado e formatado via hooks pre-commit

### Configuração de Desenvolvimento

1. Faça fork e clone o repositório
2. Instale dependências: `npm install`
3. **Fluxo de trabalho de desenvolvimento**:
   - **Para desenvolvimento ativo**: Use `./bin/dev.js COMMAND` para executar comandos diretamente dos arquivos fonte TypeScript (sem necessidade de build)
   - **Para testes finais**: Use `npm run build && ./bin/run.js COMMAND` para testar o build de produção
4. Faça suas mudanças e execute testes: `npm test`
5. Envie um pull request

**Modos de Execução CLI:**
- `./bin/dev.js` - Modo desenvolvimento (arquivos fonte TypeScript com ts-node, mudanças instantâneas)
- `./bin/run.js` - Modo produção (JavaScript compilado de dist/, requer build)

O projeto usa Husky + lint-staged para verificações automáticas de qualidade de código antes dos commits.

## Suporte a Idiomas

O gcal-commander suporta internacionalização (i18n) e está disponível em múltiplos idiomas:

**Idiomas Suportados:**
- **English** (`en`) - Padrão
- **Japanese** (`ja`) - 日本語  
- **Spanish** (`es`) - Español
- **German** (`de`) - Deutsch
- **Portuguese** (`pt`) - Português
- **French** (`fr`) - Français
- **Korean** (`ko`) - 한국어

```bash
# Mudar para japonês
gcal config set language ja

# Mudar para espanhol
gcal config set language es

# Mudar para alemão
gcal config set language de

# Mudar para português
gcal config set language pt

# Mudar para francês
gcal config set language fr

# Mudar para coreano
gcal config set language ko

# Voltar para inglês  
gcal config set language en

# Ver configuração de idioma atual
gcal config get language
```

Todas as mensagens de saída de comandos, mensagens de erro e mensagens de status serão exibidas no idioma selecionado.