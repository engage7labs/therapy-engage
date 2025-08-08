# Azure OpenAI Terraform Module

Este módulo provisiona um recurso Azure OpenAI Service no Azure, configurado para uso em produção com monitoramento e segurança.

## Recursos Criados

- `azurerm_cognitive_account` - Serviço Azure OpenAI
- `azurerm_monitor_diagnostic_setting` - Configurações de diagnóstico (opcional)

## Uso

```hcl
module "azure_openai" {
  source = "./modules/azure_openai"
  
  name                = "therapyengage-openai-dev"
  location            = "North Europe"
  resource_group_name = module.aks.resource_group_name
  
  tags = {
    Environment = "development"
    Project     = "therapy-engage"
    Component   = "ai-services"
  }
  
  # Opcional: habilitar diagnósticos
  enable_diagnostics          = true
  log_analytics_workspace_id  = module.monitoring.log_analytics_workspace_id
}
```

## Entradas

| Nome | Descrição | Tipo | Padrão | Obrigatório |
|------|-----------|------|---------|:-----------:|
| name | Nome do recurso Azure OpenAI | `string` | n/a | sim |
| location | Localização do recurso Azure | `string` | `"North Europe"` | não |
| resource_group_name | Nome do grupo de recursos | `string` | n/a | sim |
| tags | Tags para aplicar ao recurso | `map(string)` | `{}` | não |
| enable_diagnostics | Habilitar configurações de diagnóstico | `bool` | `false` | não |
| log_analytics_workspace_id | ID do workspace do Log Analytics | `string` | `null` | não |
| sku_name | SKU do Azure OpenAI | `string` | `"S0"` | não |
| public_network_access_enabled | Permitir acesso público | `bool` | `true` | não |
| custom_subdomain_name | Nome do subdomínio customizado | `string` | `null` | não |

## Saídas

| Nome | Descrição |
|------|-----------|
| azure_openai_endpoint | Endpoint do Azure OpenAI |
| azure_openai_id | ID do recurso Azure OpenAI |
| azure_openai_name | Nome do recurso Azure OpenAI |
| azure_openai_location | Localização do Azure OpenAI |
| azure_openai_primary_access_key | Chave primária de acesso (sensível) |
| azure_openai_secondary_access_key | Chave secundária de acesso (sensível) |
| azure_openai_custom_subdomain | Subdomínio customizado |
| azure_openai_config | Configuração completa para aplicações |
| environment_variables | Variáveis de ambiente recomendadas |

## Deployment de Modelos

⚠️ **Importante**: O Terraform não suporta nativamente o deployment de modelos do Azure OpenAI. Após provisionar o recurso, você deve deployar os modelos manualmente:

### Via Azure CLI:
```bash
az cognitiveservices account deployment create \
  --resource-group myResourceGroup \
  --name myOpenAIService \
  --deployment-name gpt-4 \
  --model-name gpt-4 \
  --model-version "0613" \
  --model-format OpenAI \
  --sku-capacity 1 \
  --sku-name "Standard"
```

### Via Portal Azure:
1. Acesse o recurso Azure OpenAI no portal
2. Vá para "Model deployments"
3. Clique em "Create new deployment"
4. Selecione o modelo `gpt-4` ou `gpt-4-turbo`
5. Configure a capacidade conforme necessário

## Configuração da Aplicação

Use as saídas `environment_variables` para configurar sua aplicação:

```bash
AZURE_OPENAI_ENDPOINT=https://therapyengage-openai-dev.openai.azure.com/
AZURE_OPENAI_RESOURCE=therapyengage-openai-dev
AZURE_OPENAI_DEPLOYMENT=gpt-4
AZURE_OPENAI_API_VERSION=2024-02-15-preview
AZURE_OPENAI_API_KEY=<chave_de_acesso>
```

## Segurança

- As chaves de acesso são marcadas como sensíveis
- Acesso público está habilitado por padrão (pode ser alterado via variável)
- Suporte a configurações de diagnóstico para auditoria
- Lifecycle policy previne destruição acidental

## Limitações

- Deployment de modelos deve ser feito manualmente
- Apenas SKU S0 é suportado atualmente
- Requer permissões adequadas no Azure para criar recursos Cognitive Services

## Versões Suportadas

- Terraform >= 1.0
- azurerm provider >= 3.0
