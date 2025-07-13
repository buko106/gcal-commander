# gcal init

Configuração interativa com seleção de idioma e verificação de autenticação do Google Calendar.

## Uso

```bash
gcal init [opções]
```

## Opções

| Flag | Abrev. | Descrição | Padrão |
|------|--------|-----------|---------|
| `--format` | `-f` | Formato de saída (table, json, pretty-json) | `table` |
| `--quiet` | `-q` | Ocultar saída não essencial (mensagens de status, indicadores de progresso) | `false` |

## Descrição

O comando `init` fornece uma experiência de configuração interativa que ajuda você:

1. **Selecionar seu idioma preferido** das opções suportadas (Inglês, Japonês, Espanhol, Alemão, Português, Francês, Coreano)
2. **Verificar a autenticação do Google Calendar** testando sua conexão com a API do Google Calendar

Ele garante que:
- Seu idioma de interface esteja configurado conforme sua preferência
- Arquivos de credenciais estão configurados corretamente
- Tokens de autenticação são válidos
- Você tem acesso ao Google Calendar

Este comando é especialmente útil para:
- Configuração inicial do gcal-commander
- Solução de problemas de autenticação
- Verificação da configuração após fazer mudanças nas credenciais

## Exemplos

### Uso básico

```bash
# Verificar autenticação com prompt de confirmação
gcal init

# Verificar autenticação silenciosamente (para scripts)
gcal init --quiet
```

## Fluxo interativo

Ao executar `gcal init`, você verá um prompt de confirmação para verificação de autenticação:

```
Isso verificará a autenticação do Google Calendar.
? Verificar autenticação? (Y/n) 
```

- Pressione Enter ou digite `y` para continuar com a verificação
- Digite `n` para cancelar a operação

**Nota**: A mensagem de status inicial "Isso verificará a autenticação do Google Calendar." é sempre mostrada, mesmo ao usar a flag `--quiet`. A flag `--quiet` apenas oculta a mensagem de progresso "Verificando autenticação do Google Calendar...".

## Saída de sucesso

Quando a autenticação é bem-sucedida:

```
✓ Verificando autenticação do Google Calendar...
Autenticação bem-sucedida!
```

## Tratamento de erros

Se a autenticação falhar, você verá uma mensagem de erro com informações de solução de problemas:

```
✗ Verificando autenticação do Google Calendar...
Erro de autenticação: [detalhes do erro]
Tente o comando novamente ou verifique suas credenciais da API do Google Calendar.
```

Erros comuns de autenticação:
- Arquivo de credenciais ausente ou inválido
- Tokens de autenticação expirados
- Permissões insuficientes
- Problemas de conectividade de rede

## Pré-requisitos

Antes de executar `gcal init`, certifique-se de ter:

1. **API do Google Calendar habilitada** - Habilitada no Google Cloud Console
2. **Credenciais OAuth 2.0** - Baixadas e colocadas em `~/.gcal-commander/credentials.json`
3. **Acesso à rede** - Acesso às APIs do Google

Se você ainda não configurou a autenticação, siga o guia de [Configuração inicial](../README.md#configuração-inicial) no README.

## Solução de problemas

### Falha de autenticação

Se `gcal init` falhar:

1. **Verificar arquivo de credenciais**: Certifique-se de que `~/.gcal-commander/credentials.json` existe e contém credenciais OAuth 2.0 válidas
2. **Regenerar token**: Exclua `~/.gcal-commander/token.json` e execute qualquer comando gcal para reautenticar
3. **Verificar acesso à API**: Confirme que a API do Google Calendar está habilitada no Google Cloud Console
4. **Verificar rede**: Certifique-se de ter acesso à internet e pode alcançar os servidores do Google

### Permissões de arquivo

Se você encontrar erros de permissões:

```bash
# Verificar permissões de arquivo
ls -la ~/.gcal-commander/

# Corrigir permissões se necessário
chmod 600 ~/.gcal-commander/credentials.json
chmod 600 ~/.gcal-commander/token.json
```

## Casos de uso

- **Verificação de configuração inicial** - Confirmar que a autenticação está funcionando após a configuração
- **Solução de problemas** - Diagnosticar problemas de autenticação
- **Integração CI/CD** - Verificar autenticação em ambientes automatizados
- **Verificação de saúde** - Verificar periodicamente que a autenticação ainda é válida

## Comandos relacionados

- [`gcal calendars list`](calendars-list.md) - Listar calendários disponíveis (também testa autenticação)
- [`gcal events list`](events-list.md) - Listar eventos (requer autenticação)
- [`gcal config`](config.md) - Gerenciar configuração

## Referências

- [Guia de configuração inicial](../README.md#configuração-inicial) - Passos completos de configuração
- [Configuração da API do Google Calendar](https://console.cloud.google.com/) - Google Cloud Console