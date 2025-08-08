# Backend CosmosDB Integration - Deployment Guide

## 🎯 Overview

Este guia documenta como fazer o deploy do backend NestJS com integração ao CosmosDB usando Helm Charts com Secrets seguros.

## 📋 Pré-requisitos

- Terraform executado com sucesso (`make apply-dev`)
- CosmosDB provisionado no Azure
- Cluster Kubernetes disponível
- Helm 3.x instalado

## 🔧 Configuração

### 1. Estrutura de Arquivos Criada

```
charts/backend-app/
├── values.dev.yaml          # Configurações específicas para DEV
├── templates/
│   ├── _helpers.tpl         # Funções de template Helm
│   ├── secret.yaml          # Secret com credenciais CosmosDB
│   └── deployment.yaml      # Deployment atualizado
```

### 2. Variáveis de Ambiente Configuradas

O backend agora recebe estas variáveis via Kubernetes Secret:

```yaml
COSMOSDB_ENDPOINT: "https://therapyengage-cosmosdb-dev.documents.azure.com:443/"
COSMOSDB_DATABASE_NAME: "therapyengage"
COSMOSDB_CONTAINER_NAME: "patient_videos"
COSMOSDB_KEY: "<chave-secreta>"
```

## 🚀 Deploy Options

### Opção 1: Deploy com Chave de Teste (Desenvolvimento)

```bash
make deploy-backend-dev
```

- ✅ Rápido para testes locais
- ⚠️ Usa chave dummy "CHAVE_LOCAL_TESTE"
- ❌ Não funciona com CosmosDB real

### Opção 2: Deploy Seguro (Recomendado)

```bash
# Primeiro, obter a chave real do CosmosDB
COSMOSDB_KEY=$(make get-cosmosdb-key)

# Deploy com chave real
COSMOSDB_KEY="$COSMOSDB_KEY" make deploy-backend-dev-secure
```

- ✅ Usa credenciais reais
- ✅ Funciona com CosmosDB em produção
- ✅ Chave não fica no repositório

### Opção 3: Deploy Manual com Helm

```bash
# Com chave de teste
helm upgrade --install backend-app charts/backend-app/ \
  -f charts/backend-app/values.dev.yaml \
  --set cosmosdb.key="CHAVE_LOCAL_TESTE"

# Com chave real
helm upgrade --install backend-app charts/backend-app/ \
  -f charts/backend-app/values.dev.yaml \
  --set cosmosdb.key="$(az cosmosdb keys list --name therapyengage-cosmosdb-dev --resource-group rg-therapy-dev --query primaryMasterKey -o tsv)"
```

## 🔒 Segurança

### ✅ Práticas Implementadas

1. **Secret Kubernetes**: Credenciais armazenadas em Secret
2. **Helm Override**: Chave passada via `--set` sem commit
3. **Environment Isolation**: Arquivo `values.dev.yaml` específico
4. **Resource Policy**: Secret com `helm.sh/resource-policy: keep`

### ⚠️ Importante

- **NUNCA** commitar a chave real no repositório
- **SEMPRE** usar `--set cosmosdb.key=...` para override
- **VERIFICAR** que `values.dev.yaml` contém apenas `"CHAVE_LOCAL_TESTE"`

## 🧪 Validação

### 1. Verificar Secret Criado

```bash
kubectl get secret backend-secrets -o yaml
kubectl get secret backend-secrets -o jsonpath='{.data.COSMOSDB_ENDPOINT}' | base64 -d
```

### 2. Verificar Pod do Backend

```bash
kubectl get pods -l app=backend-app
kubectl logs -l app=backend-app --tail=50
```

### 3. Testar Health Checks

```bash
# Health check básico
kubectl port-forward svc/backend-app-service 3001:80
curl http://localhost:3001/health

# Health check CosmosDB
curl -X POST http://localhost:3001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { cosmosHealthCheck }"}'
```

## 📈 Próximos Passos

### Para Produção

1. **Azure Key Vault**: Integrar com CSI Driver
2. **Managed Identity**: Remover dependência de chaves
3. **External Secrets**: Usar External Secrets Operator
4. **Monitoring**: Adicionar alertas para health checks

### Para Desenvolvimento

1. **Local Testing**: Script para setup local
2. **Integration Tests**: Testes automatizados
3. **CI/CD Pipeline**: GitHub Actions com Helm

## 🆘 Troubleshooting

### CosmosDB Connection Failed

```bash
# Verificar se as variáveis estão corretas
kubectl exec -it deployment/backend-app -- env | grep COSMOSDB

# Verificar logs do aplicativo
kubectl logs -l app=backend-app --tail=100

# Testar conectividade manual
kubectl exec -it deployment/backend-app -- curl -v https://therapyengage-cosmosdb-dev.documents.azure.com:443/
```

### Secret não Encontrado

```bash
# Verificar se o secret existe
kubectl get secrets | grep backend

# Recriar o secret manualmente se necessário
kubectl delete secret backend-secrets
helm upgrade --install backend-app charts/backend-app/ -f charts/backend-app/values.dev.yaml --set cosmosdb.key="YOUR_KEY"
```

---

## 🔧 Comandos Úteis

```bash
# Ver todos os comandos disponíveis
make help

# Deploy rápido para desenvolvimento
make deploy-backend-dev

# Deploy seguro para testes reais
COSMOSDB_KEY="$(make get-cosmosdb-key)" make deploy-backend-dev-secure

# Verificar status do deployment
kubectl get all -l app=backend-app

# Ver logs em tempo real
kubectl logs -f deployment/backend-app
```
