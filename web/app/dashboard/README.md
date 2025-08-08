# Dashboard de Análise de Sentimentos - README

## Visão Geral

Dashboard completo para análise de sentimentos de uploads de pacientes na plataforma Therapy Engage.

## Status da Implementação

✅ **COMPLETO** - Todas as funcionalidades implementadas e testadas

## Funcionalidades

- 📊 Visualização de uploads de mídia (áudio/vídeo)
- 📈 Gráficos de tendência de sentimentos
- 🚨 Sistema de alertas clínicos
- 🔍 Filtros por paciente e tipo de mídia
- 📱 Design responsivo
- 🌐 Suporte multi-idioma (PT/EN/ES)

## Estrutura de Arquivos

```
web/app/dashboard/
├── layout.tsx                    # Layout compartilhado
├── page.tsx                     # Dashboard principal
└── sentiment-analysis/
    └── page.tsx                 # Análise de sentimentos

web/hooks/
└── use-sentiment-analysis.ts    # Hook com dados mock

web/lib/types/
└── dashboard.ts                 # Interfaces TypeScript
```

## Como Usar

1. **Login**: Use credenciais de terapeuta (dr.smith / demo123)
2. **Navegação**: Clique em "Análise de Sentimentos" no sidebar
3. **Exploração**: Use filtros e interaja com modais

## Dados Mock

O sistema inclui dados realistas para demonstração:

- 7 entradas de mídia
- 4 pacientes
- 2 alertas clínicos
- Sentimentos variados (-0.8 a +0.8)

## Tecnologias

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Recharts
- shadcn/ui

## Próximos Passos

- [ ] Integração com APIs reais
- [ ] Notificações em tempo real
- [ ] Exportação de relatórios
- [ ] Analytics avançadas

## Documentação Completa

Ver: `/docs/SENTIMENT_ANALYSIS_DASHBOARD.md`
