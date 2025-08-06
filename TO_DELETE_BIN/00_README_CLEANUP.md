# Arquivos Quarentinados - MVP Cleanup

## 📁 Estrutura de Quarentena
```
TO_DELETE_BIN/
├── mobile/                        # Pasta mobile vazia (apenas .gitignore)
├── root-temp-files/               # Arquivos temporários da raiz
│   ├── package.json               # Package proxy.js (não Next.js)
│   ├── package-lock.json          # Lock do proxy.js
│   ├── proxy.js                   # Servidor proxy desenvolvimento
│   ├── Makefile                   # Build scripts desenvolvimento
│   ├── test.dockerfile            # Docker teste
│   └── vscode-extensions-backup.txt # Backup extensões VSCode
├── web-backup-20250805_182322/    # Backup completo pasta web (501.35 MB)
├── web-components-duplicated/     # Pasta components/ raiz duplicada (698 KB)
├── web-contexts-duplicated/       # Pasta contexts/ raiz duplicada (17 KB)
├── web-deploy/                    # Artifacts de build (.next) (140.88 MB)
├── web-hooks-duplicated/          # Pasta hooks/ raiz duplicada (29 KB)
├── web-lib-duplicated/            # Pasta lib/ raiz duplicada (13 KB)
├── web-nested/                    # Pasta web/web/ aninhada (6 MB)
├── web-scripts-temp/              # Scripts correção temporários (18 KB)
│   ├── disable-spark.ps1          # Script desabilitar Spark UI
│   ├── fix-all-icons.js           # Script correção ícones
│   ├── fix-comments.ps1           # Script correção comentários
│   ├── fix-imports.ps1            # Script correção imports
│   ├── fix-lucide-icons.ps1       # Script correção Lucide icons
│   ├── fix-lucide-imports.ps1     # Script correção Lucide imports
│   ├── fix-structures.ps1         # Script correção estruturas
│   ├── fix-weight-prop.js         # Script correção props weight
│   └── package.json.spark         # Package.json backup Spark UI
└── web-src-duplicated/            # Pasta src/ Next.js legacy (792 KB)
```

## 🧹 Resumo da Limpeza

### ✅ Arquivos Removidos
- **Total quarentinado:** ~650 MB
- **Duplicações eliminadas:** 6 estruturas duplicadas
- **Arquivos temporários:** 15 scripts e backups
- **Build artifacts:** 1826 arquivos .next

### 📊 Impacto na Compilação
- Arquivos analisados: **De 2214+ → ~500 arquivos**
- Redução: **≈75% menos arquivos para processar**
- Performance: **Build mais rápido**
- Manutenção: **Estrutura mais clara**

### 🔄 Estrutura Final Limpa
```
therapy-engage/
├── backend/                       # ✅ NestJS GraphQL API
├── web/                          # ✅ Next.js 14+ App Router
│   ├── app/                      # ✅ App Router principal
│   │   ├── components/           # ✅ Componentes únicos
│   │   ├── contexts/             # ✅ Contexts únicos
│   │   ├── hooks/                # ✅ Hooks únicos (inclui use-kv.ts)
│   │   └── lib/                  # ✅ Utils únicos
│   ├── package.json              # ✅ Dependencies Next.js
│   └── next.config.js            # ✅ Config Next.js
├── infra/                        # ✅ Terraform Azure
├── charts/                       # ✅ Helm deployments
└── docs/                         # ✅ Documentação
```

## 🚨 ATENÇÃO - Post-MVP Cleanup

### Para restaurar (se necessário):
```bash
# Restaurar pasta específica
robocopy "TO_DELETE_BIN\web-components-duplicated" "web\components" /E

# Restaurar arquivo específico  
copy "TO_DELETE_BIN\root-temp-files\proxy.js" "."
```

### Arquivos marcados para exclusão definitiva:
- Todos os conteúdos de `TO_DELETE_BIN/` podem ser excluídos após validação do MVP
- Manter apenas por período de segurança (30 dias)

---
**Tag de Cleanup:** ###desabilitado_mvp_cleanup###
**Data:** 06/08/2025 06:18 AM
**Status:** ✅ Quarentena completa - Pronto para MVP build
