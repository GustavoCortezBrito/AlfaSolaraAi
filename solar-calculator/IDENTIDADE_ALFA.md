# 🎨 Identidade Visual Alfa Solar

## Sobre a Alfa Esquadrias

A **Alfa Esquadrias** é uma empresa especializada em esquadrias de alumínio localizada em **Presidente Prudente/SP**. Com anos de experiência no mercado, a empresa oferece:

- Kit sacada
- Coberturas
- Guarda corpo
- Fechadas
- Portas de alumínio

Agora expandindo para o ramo de **Energia Solar** com a marca **Alfa Solar**.

## 🎨 Paleta de Cores

### Cores Principais

#### Azul Alfa (Primário)
```css
/* Azul principal */
#3b82f6 (rgb(59, 130, 246))

/* Variações */
blue-400: #60a5fa
blue-500: #3b82f6 (principal)
blue-600: #2563eb
blue-700: #1d4ed8
```

#### Cyan (Secundário)
```css
/* Cyan complementar */
#22d3ee (rgb(34, 211, 238))

/* Variações */
cyan-300: #67e8f9
cyan-400: #22d3ee (principal)
cyan-500: #06b6d4
cyan-600: #0891b2
```

#### Prata/Cinza (Metálico)
```css
/* Tons de cinza metálico */
slate-800: #1e293b
slate-900: #0f172a
gray-700: #374151
gray-800: #1f2937
```

### Gradientes

#### Gradiente Principal
```css
background: linear-gradient(to right, #3b82f6, #22d3ee);
/* from-blue-500 to-cyan-400 */
```

#### Gradiente Hover
```css
background: linear-gradient(to right, #2563eb, #06b6d4);
/* from-blue-600 to-cyan-500 */
```

#### Gradiente de Fundo
```css
background: linear-gradient(to bottom right, #0f172a, #1e293b, #0f172a);
/* from-slate-900 via-slate-800 to-slate-900 */
```

## 🏢 Aplicação da Marca

### Logo
- **Símbolo**: Duplo "A" estilizado
- **Cores**: Gradiente azul para cyan
- **Estilo**: Moderno, metálico, profissional

### Tipografia
- **Fonte Principal**: Inter (sans-serif)
- **Peso**: 300-900
- **Estilo**: Limpo, moderno, legível

### Elementos Visuais
- Bordas arredondadas (rounded-lg)
- Sombras suaves (shadow-lg)
- Efeitos de vidro (backdrop-blur)
- Animações suaves (Framer Motion)

## 📱 Aplicação na Calculadora Solar

### Cabeçalho
```typescript
- Logo Alfa com gradiente azul/cyan
- Título "ALFA SOLAR"
- Subtítulo "Calculadora Solar Inteligente"
- Localização: Presidente Prudente/SP
```

### Indicador de Progresso
```typescript
- Círculos: Gradiente blue-500 to cyan-400
- Linhas: Gradiente animado
- Labels ativos: text-cyan-400
```

### Botões
```typescript
// Primário
bg-gradient-to-r from-blue-500 to-cyan-400
hover:from-blue-600 hover:to-cyan-500

// Secundário
border-gray-600 text-gray-300
hover:bg-gray-700
```

### Inputs
```typescript
bg-gray-800
border-gray-700
focus:ring-blue-500
text-white
placeholder-gray-500
```

### Cards de Resultado
```typescript
// Potência
bg-gradient-to-br from-blue-900/50 to-blue-800/30
border-blue-700/50
text-blue-400

// Placas
bg-gradient-to-br from-cyan-900/50 to-cyan-800/30
border-cyan-700/50
text-cyan-400

// Investimento
bg-gradient-to-br from-purple-900/50 to-purple-800/30
border-purple-700/50
text-purple-400

// Payback
bg-gradient-to-br from-orange-900/50 to-orange-800/30
border-orange-700/50
text-orange-400
```

## 📄 PDF

### Cabeçalho
```typescript
Cor de fundo: #3b82f6 (Azul Alfa)
Texto: Branco
Conteúdo:
  - "ALFA SOLAR" (24pt)
  - "ORÇAMENTO - SISTEMA FOTOVOLTAICO" (14pt)
  - "Presidente Prudente/SP" (10pt)
```

### Valores em Destaque
```typescript
Cor: #3b82f6 (Azul Alfa)
Fonte: Bold, 14pt
```

### Rodapé
```typescript
"Alfa Esquadrias - Presidente Prudente/SP"
Cor: Cinza (#808080)
Fonte: 9pt
```

## 🎯 Diretrizes de Uso

### Fazer ✅
- Usar gradientes azul/cyan para elementos principais
- Manter alto contraste (texto branco em fundo escuro)
- Usar animações suaves e profissionais
- Incluir localização (Presidente Prudente/SP)
- Manter identidade Alfa em todos os materiais

### Evitar ❌
- Cores muito vibrantes ou saturadas
- Gradientes com mais de 2 cores
- Animações muito rápidas ou bruscas
- Esquecer a marca Alfa
- Usar verde (cor antiga, não da marca)

## 🔄 Migração de Cores

### Antes (Genérico)
```css
emerald-500 → blue-500
teal-400 → cyan-400
green-* → blue-*
```

### Depois (Alfa)
```css
blue-500 (Azul principal)
cyan-400 (Cyan complementar)
slate-900 (Fundo escuro)
```

## 📊 Hierarquia Visual

### Nível 1 - Mais Importante
- Logo Alfa
- Título principal
- Botões de ação primária
- Valores de investimento

### Nível 2 - Importante
- Subtítulos
- Labels de campos
- Indicador de progresso
- Cards de resultado

### Nível 3 - Secundário
- Texto descritivo
- Placeholders
- Rodapé
- Informações adicionais

## 🌐 Consistência Multi-plataforma

### Web
- Gradientes azul/cyan
- Fundo escuro slate
- Animações Framer Motion

### PDF
- Cabeçalho azul Alfa
- Valores em azul
- Rodapé com marca

### Mobile
- Mesmas cores
- Layout responsivo
- Touch-friendly

## 📞 Informações de Contato

Para incluir em materiais:

```
Alfa Esquadrias
Presidente Prudente/SP
[Telefone/WhatsApp]
[Email]
[Site/Instagram]
```

## 🎨 Exemplos de Código

### Botão Alfa
```tsx
<button className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-500 transition-all shadow-lg">
  Solicitar Orçamento
</button>
```

### Card Alfa
```tsx
<div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
  <h3 className="text-cyan-400 font-semibold mb-2">Título</h3>
  <p className="text-gray-300">Conteúdo</p>
</div>
```

### Input Alfa
```tsx
<input 
  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
  placeholder="Digite aqui..."
/>
```

---

## 📝 Notas Finais

Esta identidade visual foi desenvolvida para:
- Refletir profissionalismo e modernidade
- Manter consistência com a marca Alfa Esquadrias
- Diferenciar o ramo Solar mantendo a identidade corporativa
- Proporcionar excelente experiência ao usuário
- Garantir legibilidade e acessibilidade

**Versão**: 1.0
**Data**: Janeiro 2026
**Empresa**: Alfa Esquadrias - Presidente Prudente/SP
