# 📂 Estrutura Detalhada do Projeto

## Visão Geral

```
solar-calculator/
├── 📁 app/                      # Diretório principal do Next.js (App Router)
├── 📁 components/               # Componentes React reutilizáveis
├── 📁 types/                    # Definições TypeScript
├── 📁 public/                   # Arquivos estáticos
├── 📁 node_modules/             # Dependências (não versionar)
├── 📄 Arquivos de configuração
└── 📄 Documentação
```

---

## 📁 Diretório `app/`

Estrutura do Next.js 15 com App Router.

### `app/layout.tsx`
**Propósito**: Layout raiz da aplicação
**Conteúdo**:
- Configuração de fontes (Geist)
- Metadata (título, descrição)
- HTML wrapper
- Configuração de idioma (pt-BR)

### `app/page.tsx`
**Propósito**: Página principal (home)
**Conteúdo**:
- Título e descrição
- Componente SolarForm
- Footer com créditos
- Animações de entrada

### `app/globals.css`
**Propósito**: Estilos globais
**Conteúdo**:
- Imports do Tailwind
- Reset CSS
- Variáveis CSS customizadas

### `app/api/calculate/route.ts`
**Propósito**: API Route para cálculos com IA
**Responsabilidades**:
- Receber dados do formulário
- Calcular consumo adicional
- Montar prompt para Gemini
- Enviar para IA
- Processar resposta JSON
- Retornar cálculos

**Endpoint**: `POST /api/calculate`

**Input**:
```typescript
{
  cidade: string;
  estado: string;
  cep?: string;
  consumoMedioMensal: number;
  pretendAumentar: boolean;
  equipamentosAdicionais?: Array<{
    nome: string;
    potenciaWatts: number;
    quantidade: number;
    horasUsoDia: number;
  }>;
}
```

**Output**:
```typescript
{
  potencia_kwp: number;
  quantidade_placas: number;
  placa_watts: number;
  inversor: string;
  custo_estimado: number;
  payback_anos: number;
  explicacao: string;
  consumo_total_kwh: number;
  irradiacao_media: number;
}
```

### `app/api/generate-pdf/route.ts`
**Propósito**: API Route para geração de PDF
**Responsabilidades**:
- Receber dados completos
- Criar documento PDF com jsPDF
- Formatar layout profissional
- Adicionar cabeçalho colorido
- Organizar informações
- Retornar arquivo para download

**Endpoint**: `POST /api/generate-pdf`

**Input**: FormData + CalculationResult + dataGeracao

**Output**: Arquivo PDF (application/pdf)

---

## 📁 Diretório `components/`

Componentes React modulares e reutilizáveis.

### `SolarForm.tsx`
**Propósito**: Componente principal do formulário
**Responsabilidades**:
- Gerenciar estado do formulário
- Controlar navegação entre etapas
- Validar dados
- Fazer chamadas às APIs
- Exibir resultados
- Gerenciar loading e erros

**Estado**:
```typescript
- currentStep: number          // Etapa atual (1-4)
- loading: boolean             // Estado de carregamento
- error: string                // Mensagem de erro
- result: CalculationResult    // Resultado dos cálculos
- formData: FormData           // Dados do formulário
```

**Métodos**:
- `updateFormData()` - Atualizar campo
- `canProceed()` - Validar etapa
- `handleNext()` - Avançar etapa
- `handleBack()` - Voltar etapa
- `handleSubmit()` - Enviar para cálculo
- `handleDownloadPDF()` - Baixar PDF
- `handleNewQuote()` - Novo orçamento

### `StepIndicator.tsx`
**Propósito**: Indicador visual de progresso
**Props**:
- `currentStep: number` - Etapa atual
- `totalSteps: number` - Total de etapas

**Funcionalidades**:
- Círculos numerados
- Linhas de conexão
- Animação de progresso
- Labels das etapas

### `Step1Location.tsx`
**Propósito**: Etapa 1 - Coleta de localização
**Campos**:
- Cidade (input text, obrigatório)
- Estado (select, obrigatório)
- CEP (input text, opcional)

**Validação**:
- Cidade não vazia
- Estado selecionado

### `Step2Consumption.tsx`
**Propósito**: Etapa 2 - Coleta de consumo
**Campos**:
- Consumo médio mensal (input number, obrigatório)

**Validação**:
- Valor maior que 0

**Extras**:
- Dica sobre onde encontrar o valor

### `Step3Expansion.tsx`
**Propósito**: Etapa 3 - Expansão futura
**Campos**:
- Pretende aumentar? (toggle Sim/Não)
- Lista de equipamentos (condicional)

**Equipamentos Pré-configurados**:
- Ar Condicionado (1500W)
- Chuveiro Elétrico (5500W)
- Piscina/Bomba (1000W)
- Veículo Elétrico (7000W)
- Aquecedor Elétrico (3000W)
- Outro (customizável)

**Funcionalidades**:
- Adicionar equipamento
- Remover equipamento
- Editar campos de cada equipamento
- Validação de campos obrigatórios

### `Step4Review.tsx`
**Propósito**: Etapa 4 - Revisão dos dados
**Funcionalidades**:
- Exibir resumo de localização
- Exibir consumo atual
- Calcular e exibir consumo adicional
- Exibir consumo total
- Listar equipamentos adicionais
- Mensagem de confirmação

---

## 📁 Diretório `types/`

### `index.ts`
**Propósito**: Definições TypeScript centralizadas

**Tipos Exportados**:

```typescript
// Dados do formulário
interface FormData {
  cidade: string;
  estado: string;
  cep?: string;
  consumoMedioMensal: number;
  pretendAumentar: boolean;
  equipamentosAdicionais?: EquipamentoAdicional[];
}

// Equipamento adicional
interface EquipamentoAdicional {
  nome: string;
  potenciaWatts: number;
  quantidade: number;
  horasUsoDia: number;
}

// Resultado dos cálculos
interface CalculationResult {
  potencia_kwp: number;
  quantidade_placas: number;
  placa_watts: number;
  inversor: string;
  custo_estimado: number;
  payback_anos: number;
  explicacao: string;
  consumo_total_kwh: number;
  irradiacao_media: number;
}

// Dados para PDF
interface PDFData extends FormData {
  calculation: CalculationResult;
  dataGeracao: string;
}
```

---

## 📁 Diretório `public/`

Arquivos estáticos servidos diretamente.

**Arquivos Padrão**:
- `next.svg` - Logo do Next.js
- `vercel.svg` - Logo da Vercel
- `file.svg`, `globe.svg`, `window.svg` - Ícones

**Uso**:
- Adicione logos, imagens, ícones aqui
- Acesse via `/nome-do-arquivo.ext`

---

## 📄 Arquivos de Configuração

### `package.json`
**Propósito**: Gerenciamento de dependências e scripts

**Dependências Principais**:
- `next` - Framework
- `react`, `react-dom` - UI
- `typescript` - Tipagem
- `tailwindcss` - Estilos
- `framer-motion` - Animações
- `@google/generative-ai` - Gemini AI
- `jspdf` - Geração de PDF

**Scripts**:
- `dev` - Desenvolvimento
- `build` - Build de produção
- `start` - Servidor de produção
- `lint` - Linter

### `tsconfig.json`
**Propósito**: Configuração do TypeScript

**Configurações Importantes**:
- `strict: true` - Modo estrito
- `paths: { "@/*": ["./*"] }` - Alias de importação
- `jsx: "react-jsx"` - Suporte JSX

### `tailwind.config.ts`
**Propósito**: Configuração do TailwindCSS

**Conteúdo**:
- Paths de conteúdo
- Extensões de tema
- Plugins

### `next.config.ts`
**Propósito**: Configuração do Next.js

**Configurações**:
- Otimizações
- Variáveis de ambiente
- Redirects/Rewrites

### `.env.example`
**Propósito**: Exemplo de variáveis de ambiente

**Variáveis**:
```
GEMINI_API_KEY=sua_chave_api_aqui
```

### `.gitignore`
**Propósito**: Arquivos ignorados pelo Git

**Principais**:
- `node_modules/`
- `.next/`
- `.env*.local`
- `*.log`

---

## 📄 Documentação

### `README.md`
Documentação principal do projeto

### `INICIO_RAPIDO.md`
Guia de início rápido (5 minutos)

### `CUSTOMIZACAO.md`
Guia de customização e personalização

### `DEPLOY.md`
Guia de deploy em diferentes plataformas

### `COMO_TESTAR.md`
Guia completo de testes

### `EXEMPLO_RESPOSTA_IA.json`
Exemplo de resposta da IA Gemini

### `RESUMO_PROJETO.md`
Resumo executivo do projeto

### `ESTRUTURA_PROJETO.md`
Este arquivo - estrutura detalhada

---

## 🔄 Fluxo de Dados

```
┌─────────────┐
│   Usuário   │
└──────┬──────┘
       │ Preenche formulário
       ▼
┌─────────────────┐
│   SolarForm     │ (Estado local)
└────────┬────────┘
         │ Envia dados
         ▼
┌──────────────────┐
│ /api/calculate   │
└────────┬─────────┘
         │ Monta prompt
         ▼
┌──────────────────┐
│   Gemini AI      │
└────────┬─────────┘
         │ Retorna JSON
         ▼
┌──────────────────┐
│   SolarForm      │ (Exibe resultado)
└────────┬─────────┘
         │ Solicita PDF
         ▼
┌──────────────────┐
│ /api/generate-pdf│
└────────┬─────────┘
         │ Gera PDF
         ▼
┌──────────────────┐
│   Download       │
└──────────────────┘
```

---

## 🎨 Padrões de Código

### Nomenclatura
- Componentes: PascalCase (`SolarForm.tsx`)
- Funções: camelCase (`handleSubmit`)
- Constantes: UPPER_SNAKE_CASE (`API_URL`)
- Tipos: PascalCase (`FormData`)

### Organização de Imports
```typescript
// 1. Bibliotecas externas
import { useState } from 'react';
import { motion } from 'framer-motion';

// 2. Imports internos
import { FormData } from '@/types';
import StepIndicator from '@/components/StepIndicator';

// 3. Estilos (se houver)
import './styles.css';
```

### Estrutura de Componente
```typescript
'use client'; // Se necessário

// Imports

// Tipos/Interfaces
interface Props {
  // ...
}

// Componente
export default function Component({ props }: Props) {
  // Estado
  const [state, setState] = useState();

  // Efeitos
  useEffect(() => {}, []);

  // Handlers
  const handleAction = () => {};

  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

---

## 🔧 Manutenção

### Adicionar Nova Etapa
1. Criar `StepXNome.tsx` em `components/`
2. Adicionar ao array `steps` em `StepIndicator.tsx`
3. Adicionar case em `SolarForm.tsx`
4. Atualizar validação em `canProceed()`

### Adicionar Novo Campo
1. Atualizar tipo em `types/index.ts`
2. Adicionar campo no componente Step apropriado
3. Atualizar prompt em `api/calculate/route.ts`
4. Atualizar PDF em `api/generate-pdf/route.ts`

### Modificar Cálculos
1. Editar prompt em `api/calculate/route.ts`
2. Testar com diferentes cenários
3. Validar resposta da IA

---

Esta estrutura foi projetada para ser:
- ✅ Modular e escalável
- ✅ Fácil de manter
- ✅ Bem documentada
- ✅ Seguindo best practices

---

**Última atualização**: Janeiro 2026
