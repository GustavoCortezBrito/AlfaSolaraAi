# 🌞 Alfa Solar - Calculadora Inteligente

Aplicação web para dimensionamento de sistemas fotovoltaicos com IA (Gemini), desenvolvida para a **Alfa Esquadrias** de Presidente Prudente/SP.

## 🏢 Sobre a Alfa

A **Alfa Esquadrias** é especialista em esquadrias de alumínio e agora expande para o mercado de energia solar com a marca **Alfa Solar**. Esta calculadora inteligente permite que clientes dimensionem sistemas fotovoltaicos de forma rápida e precisa.

## 🚀 Stack Tecnológica

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **TailwindCSS**
- **Framer Motion** (animações)
- **Google Gemini AI** (cálculos inteligentes)
- **jsPDF** (geração de PDF)

## 📋 Funcionalidades

### 1. Formulário em Etapas (Wizard)
- **Etapa 1**: Localização (cidade, estado, CEP)
- **Etapa 2**: Consumo médio mensal (kWh)
- **Etapa 3**: Expansão futura (equipamentos adicionais)
- **Etapa 4**: Revisão dos dados

### 2. Cálculos com IA Gemini
A IA é responsável por:
- Estimar irradiação solar da região
- Calcular potência necessária (kWp)
- Definir quantidade e potência das placas
- Especificar inversor adequado
- Estimar custo do sistema
- Calcular payback aproximado

### 3. Geração de PDF
- Layout profissional
- Dados do cliente
- Dimensionamento completo
- Orçamento detalhado
- Análise técnica da IA

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd solar-calculator
```

2. Instale as dependências:
```bash
npm install
```

3. Configure a API Key do Gemini:
```bash
cp .env.example .env.local
```

Edite `.env.local` e adicione sua chave:
```
GEMINI_API_KEY=sua_chave_api_aqui
```

Para obter a chave: https://makersuite.google.com/app/apikey

4. Execute o projeto:
```bash
npm run dev
```

5. Acesse: http://localhost:3000

## 📁 Estrutura do Projeto

```
solar-calculator/
├── app/
│   ├── api/
│   │   ├── calculate/
│   │   │   └── route.ts          # API de cálculo com Gemini
│   │   └── generate-pdf/
│   │       └── route.ts          # API de geração de PDF
│   ├── layout.tsx
│   ├── page.tsx                  # Página principal
│   └── globals.css
├── components/
│   ├── SolarForm.tsx             # Formulário principal
│   ├── StepIndicator.tsx         # Indicador de etapas
│   ├── Step1Location.tsx         # Etapa 1
│   ├── Step2Consumption.tsx      # Etapa 2
│   ├── Step3Expansion.tsx        # Etapa 3
│   └── Step4Review.tsx           # Etapa 4
├── types/
│   └── index.ts                  # Tipos TypeScript
└── .env.example
```

## 🔌 API Routes

### POST /api/calculate
Envia dados do formulário para a IA Gemini e retorna cálculos.

**Request:**
```json
{
  "cidade": "São Paulo",
  "estado": "SP",
  "consumoMedioMensal": 350,
  "pretendAumentar": true,
  "equipamentosAdicionais": [
    {
      "nome": "Ar Condicionado",
      "potenciaWatts": 1500,
      "quantidade": 2,
      "horasUsoDia": 8
    }
  ]
}
```

**Response:**
```json
{
  "potencia_kwp": 6.5,
  "quantidade_placas": 12,
  "placa_watts": 550,
  "inversor": "Inversor 6kW On-Grid",
  "custo_estimado": 28000,
  "payback_anos": 4.5,
  "explicacao": "Análise técnica detalhada...",
  "consumo_total_kwh": 470,
  "irradiacao_media": 4.8
}
```

### POST /api/generate-pdf
Gera PDF com orçamento completo.

**Request:**
```json
{
  ...formData,
  "calculation": { ...resultados },
  "dataGeracao": "16/01/2026"
}
```

**Response:** Arquivo PDF para download

## 🎨 Características da Interface

- Design moderno e responsivo
- Animações suaves com Framer Motion
- Validação de formulário em tempo real
- Feedback visual de progresso
- UX intuitiva e profissional

## 📝 Exemplo de Uso

1. Preencha a localização
2. Informe o consumo médio mensal
3. (Opcional) Adicione equipamentos futuros
4. Revise os dados
5. Clique em "Gerar Orçamento"
6. Visualize os resultados
7. Baixe o PDF

## 🔧 Scripts Disponíveis

```bash
npm run dev      # Desenvolvimento
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # Linter
```

## 🌐 Deploy

Para deploy em produção (Vercel):

1. Faça push para o GitHub
2. Conecte no Vercel
3. Configure a variável de ambiente `GEMINI_API_KEY`
4. Deploy automático

## 📄 Licença

Este projeto é de código aberto para fins educacionais.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

---

Desenvolvido com ❤️ usando Next.js e Gemini AI
