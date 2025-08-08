# SPARK IMPORT PLAN

## 🎯 Plano de Importação de Recursos do Spark

### Comandos de Cópia Prioritários:

```bash
# 1. PRIORIDADE ALTA - Dashboard Core
cp c:/dev/therapy-engage-platf/components/dashboard/emergency-whatsapp-contact.tsx c:/dev/therapy-engage/web/components/dashboard/
cp c:/dev/therapy-engage-platf/components/dashboard/patient-list.tsx c:/dev/therapy-engage/web/components/dashboard/
cp c:/dev/therapy-engage-platf/components/dashboard/quick-actions.tsx c:/dev/therapy-engage/web/components/dashboard/

# 2. PRIORIDADE ALTA - Patient Components
cp c:/dev/therapy-engage-platf/components/patient/patient-dashboard.tsx c:/dev/therapy-engage/web/components/patient/

# 3. PRIORIDADE ALTA - Internacionalização
cp c:/dev/therapy-engage-platf/components/i18n/language-selector.tsx c:/dev/therapy-engage/web/components/i18n/
cp c:/dev/therapy-engage-platf/components/i18n/multilingual-consent-form.tsx c:/dev/therapy-engage/web/components/i18n/

# 4. PRIORIDADE MÉDIA - Session Management
cp c:/dev/therapy-engage-platf/components/session/session-insights.tsx c:/dev/therapy-engage/web/components/session/
cp c:/dev/therapy-engage-platf/components/session/consent-management-dashboard.tsx c:/dev/therapy-engage/web/components/session/

# 5. PRIORIDADE MÉDIA - Hooks
cp c:/dev/therapy-engage-platf/hooks/use-auth.ts c:/dev/therapy-engage/web/hooks/
cp c:/dev/therapy-engage-platf/hooks/use-mobile.ts c:/dev/therapy-engage/web/hooks/

# 6. PRIORIDADE BAIXA - Ferramentas de Desenvolvimento
cp c:/dev/therapy-engage-platf/components/session/test-scenarios.tsx c:/dev/therapy-engage/web/components/session/
```

### Dependências Necessárias:

- `sonner` (para toasts)
- Verificar imports de `@/hooks/use-kv`
- Verificar compatibilidade com estrutura atual

### Ajustes Pós-Importação:

1. Atualizar imports para estrutura atual
2. Verificar compatibilidade com contextos existentes
3. Testar funcionalidades críticas
4. Ajustar styling se necessário
