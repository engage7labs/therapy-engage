# Helm Charts - Backend App

## 📚 Documentação

A documentação completa dos Helm Charts foi movida para:

**[docs/HELM_COSMOSDB_DEPLOYMENT.md](../../docs/HELM_COSMOSDB_DEPLOYMENT.md)**

## 🚀 Quick Deploy

```bash
# Deploy desenvolvimento
make deploy-backend-dev

# Deploy produção (seguro)
COSMOSDB_KEY="$(make get-cosmosdb-key)" make deploy-backend-dev-secure
```

## 📖 Documentação Completa

Para informações detalhadas sobre:

- Configuração Helm
- Kubernetes Secrets
- Templates
- Troubleshooting

Consulte: **[docs/HELM_COSMOSDB_DEPLOYMENT.md](../../docs/HELM_COSMOSDB_DEPLOYMENT.md)**
