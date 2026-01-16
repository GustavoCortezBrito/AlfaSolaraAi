# 🌞 Calculadora Solar com IA - Projeto Completo

## 📁 Localização do Projeto

O projeto completo está na pasta: **`solar-calculator/`**

## 🚀 Início Rápido

```bash
cd solar-calculator
npm install
cp .env.example .env.local
# Edite .env.local e adicione sua GEMINI_API_KEY
npm run dev
```

Acesse: http://localhost:3000

## 📚 Documentação Completa

Toda a documentação está dentro da pasta `solar-calculator/`:

- **README.md** - Documentação principal completa
- **INICIO_RAPIDO.md** - Guia de 5 minutos para começar
- **COMO_TESTAR.md** - Guia completo de testes
- **CUSTOMIZACAO.md** - Como personalizar a aplicação
- **DEPLOY.md** - Como fazer deploy em produção
- **ESTRUTURA_PROJETO.md** - Estrutura detalhada dos arquivos
- **RESUMO_PROJETO.md** - Resumo executivo
- **EXEMPLO_RESPOSTA_IA.json** - Exemplo de resposta da IA

## ✨ O Que Foi Criado

Uma aplicação web completa para dimensionamento de sistemas fotovoltaicos que:

✅ Coleta dados do cliente em formulário wizard (4 etapas)
✅ Usa IA Gemini para fazer TODOS os cálculos técnicos
✅ Gera orçamento profissional em PDF
✅ Interface moderna com animações (Framer Motion)
✅ Totalmente responsiva (mobile, tablet, desktop)
✅ TypeScript para segurança de tipos
✅ Código bem documentado e organizado

## 🛠️ Stack Tecnológica

- Next.js 15 (App Router)
- React 19
- TypeScript
- TailwindCSS
- Framer Motion
- Google Gemini AI
- jsPDF

## 📋 Funcionalidades

### Formulário em 4 Etapas:
1. **Localização** - Cidade, estado, CEP
2. **Consumo** - Consumo médio mensal (kWh)
3. **Expansão** - Equipamentos adicionais planejados
4. **Revisão** - Confirmação dos dados

### IA Gemini Calcula:
- Irradiação solar da região
- Potência necessária (kWp)
- Quantidade e potência das placas
- Inversor adequado
- Custo estimado
- Payback aproximado

### PDF Profissional:
- Layout limpo e moderno
- Dados do cliente
- Dimensionamento completo
- Orçamento detalhado
- Análise técnica

## 🎯 Como Usar

1. Entre na pasta do projeto:
```bash
cd solar-calculator
```

2. Leia a documentação:
- Para começar rápido: `INICIO_RAPIDO.md`
- Para entender tudo: `README.md`
- Para testar: `COMO_TESTAR.md`

3. Configure a API Key do Gemini:
- Obtenha em: https://makersuite.google.com/app/apikey
- Adicione no arquivo `.env.local`

4. Execute:
```bash
npm run dev
```

## 📦 Estrutura do Projeto

```
solar-calculator/
├── app/
│   ├── api/
│   │   ├── calculate/        # API de cálculo com IA
│   │   └── generate-pdf/     # API de geração de PDF
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── SolarForm.tsx         # Formulário principal
│   ├── StepIndicator.tsx     # Indicador de progresso
│   ├── Step1Location.tsx     # Etapa 1
│   ├── Step2Consumption.tsx  # Etapa 2
│   ├── Step3Expansion.tsx    # Etapa 3
│   └── Step4Review.tsx       # Etapa 4
├── types/
│   └── index.ts              # Tipos TypeScript
└── [Documentação completa]
```

## 🎨 Características

- ✅ Interface moderna e profissional
- ✅ Animações suaves
- ✅ Responsivo (mobile-first)
- ✅ Validação em tempo real
- ✅ Tratamento de erros
- ✅ Loading states
- ✅ TypeScript 100%
- ✅ Código limpo e documentado

## 🚀 Deploy

O projeto está pronto para deploy em:
- Vercel (recomendado)
- Netlify
- VPS próprio
- Docker

Veja instruções detalhadas em: `solar-calculator/DEPLOY.md`

## 📞 Suporte

Consulte a documentação dentro da pasta `solar-calculator/`:
1. README.md - Documentação completa
2. INICIO_RAPIDO.md - Guia rápido
3. COMO_TESTAR.md - Testes
4. CUSTOMIZACAO.md - Personalização

## ✅ Status

**PROJETO COMPLETO E FUNCIONAL**

Todos os requisitos foram implementados:
- ✅ Frontend com wizard animado
- ✅ Backend com API Routes
- ✅ Integração com Gemini AI
- ✅ Geração de PDF profissional
- ✅ Documentação completa
- ✅ Código TypeScript
- ✅ Pronto para produção

---

**Desenvolvido com ❤️ usando Next.js 15 e Gemini AI**

**Data**: Janeiro 2026
