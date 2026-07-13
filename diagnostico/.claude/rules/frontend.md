# Regras — Frontend

## Componentes
- Server Components por padrão; `"use client"` só quando há interatividade.
- Componentes de UI em `src/components/ui/`, de jornada em `src/components/diagnostic/`, admin em `src/components/admin/`.
- Nunca hexadecimal, preço ou texto de negócio hardcoded — usar tokens CSS e config central.
- Nomes previstos: BrandLogo, EditorialHeader, ProgressIndicator, QuestionCard, ArchetypeCard, PhotoUploader, AnalysisLoader, ScoreGauge, PillarScore, ArchetypeComparison, GoldDivider, InsightCard, UpgradeCard, BookingCTA, PrivacyConsent, AdminMetricCard.

## Formulários
- React Hook Form + resolvers Zod. Schema compartilhado com backend em `src/lib/schemas/`.
- Validação de e-mail e telefone BR (DDD + 8/9 dígitos).
- Uma pergunta por tela (ou pequeno grupo) com barra de progresso.
- Estado da jornada persistido (sessionStorage) para sobreviver a refresh; foto nunca em storage do navegador.

## Acessibilidade
- Navegação por teclado, foco visível, labels em todo input, mensagens de erro associadas (aria-describedby).
- Contraste AA no mínimo. `prefers-reduced-motion` respeitado em toda animação.
- Alvo de toque mínimo 44px no mobile. Gráficos com alternativa textual.

## Performance
- Mobile-first. JS só quando necessário. Imagens otimizadas (next/image).
- Não reenviar imagem original ao navegador após processamento.
- Não cachear conteúdo privado (relatórios, fotos).
