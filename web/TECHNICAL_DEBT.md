# Débito Técnico - Therapy Engage Platform

## Data: 7 de agosto de 2025

## ❌ Problema Identificado: Build de Produção com Erros de Prerendering

### Descrição
O build de produção (`npm run build`) apresenta erros do tipo "Unsupported Server Component type: {...}" em múltiplas páginas durante o processo de prerendering/static generation.

### Páginas Afetadas
- `/` (página principal)
- `/current-version` 
- `/current-version/dashboard`
- `/current-version/login`
- `/current-version/client-portal`
- `/current-version/sessions`
- `/current-version/settings`
- `/_not-found`

### Causa Raiz
O erro "Unsupported Server Component type: {...}" indica que objetos não serializáveis (como Date, função, contextos complexos) estão sendo passados entre Server e Client Components durante o processo de static generation.

### Impacto
- ✅ **Desenvolvimento**: Servidor de desenvolvimento (`npm run dev`) pode funcionar normalmente
- ❌ **Produção**: Build de produção falha no static generation
- ❌ **Docker**: Builds remotos em Docker irão falhar
- ❌ **Deploy**: Impossível fazer deploy da aplicação atual

## 🔧 Solução Implementada (Temporária)

### Código Preservado
- Todo código complexo movido para `TO_RESTORE_LATER/` na raiz do projeto
- Páginas simplificadas criadas com redirecionamentos
- Estrutura baseada no código do Spark implementada

### Arquivos Criados/Modificados
1. **app/page.tsx**: Página principal com dashboards por role baseada no Spark
2. **app/contexts/auth-context.tsx**: Context de autenticação com sessionTimeout
3. **current-version/**: Páginas simplificadas que redirecionam para app principal
4. **TO_RESTORE_LATER/**: Arquivo na raiz com todo código complexo preservado

## 📋 Próximos Passos (Obrigatórios)

### Prioridade Alta
1. **Investigar serialização**: Identificar objetos não serializáveis no contexto de auth
2. **Separar Server/Client**: Garantir que Date objects não sejam passados diretamente
3. **Testar dev server**: Confirmar que `npm run dev` funciona
4. **Migrar componentes**: Trazer componentes do Spark gradualmente

### Prioridade Média
1. **Configurar path aliases**: Ajustar tsconfig.json para produção
2. **Restaurar funcionalidades**: Usar TO_RESTORE_LATER como fonte
3. **Implementar session timeout**: Funcionalidade baseada no Spark
4. **Adicionar componentes UI**: shadcn/ui components necessários

### Prioridade Baixa
1. **Otimizar imports**: Converter imports relativos para @/ quando possível
2. **Limpar código**: Remover arquivos desnecessários
3. **Documentar**: Atualizar README com estrutura atual

## 🚨 Limitações Atuais

- **Build de produção não funciona** - aplicação não pode ser deployada
- **Funcionalidades limitadas** - apenas login básico e dashboards simples
- **Componentes básicos** - UI minimalista sem componentes avançados
- **Session management básico** - sem timeout automático

## 📊 Status de Migração

### ✅ Concluído
- [x] Preservação do código em TO_RESTORE_LATER
- [x] Página principal com role-based dashboards
- [x] Context de autenticação básico
- [x] Interface User com sessionTimeout
- [x] Mock users com timeouts por role

### 🔄 Em Progresso
- [ ] Correção dos erros de prerendering
- [ ] Teste do servidor de desenvolvimento
- [ ] Verificação de funcionalidade básica

### ⏳ Pendente
- [ ] Migração de componentes do Spark
- [ ] Session timeout automático
- [ ] Componentes UI avançados
- [ ] Build de produção funcional

## 💡 Recomendações

1. **Não usar em produção** até resolver erros de build
2. **Priorizar correção** dos erros de serialização
3. **Manter código atual** como base para desenvolvimento
4. **Migrar gradualmente** funcionalidades do TO_RESTORE_LATER

---

**Desenvolvido em**: 7 de agosto de 2025  
**Responsável**: GitHub Copilot  
**Status**: 🔴 Requer atenção imediata  
