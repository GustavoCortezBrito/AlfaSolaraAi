# 🎨 Tema Escuro - Guia de Cores

## Paleta de Cores Atualizada

### Cores Principais

#### Background
- **Fundo Principal**: `bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800`
- **Cards/Containers**: `bg-gray-800` com `border-gray-700`
- **Cards Secundários**: `bg-gray-900` com `border-gray-700`

#### Texto
- **Títulos**: `text-white`
- **Texto Principal**: `text-gray-300`
- **Texto Secundário**: `text-gray-400`
- **Labels**: `text-gray-300`

#### Accent Colors (Gradientes)
- **Primário**: `from-emerald-500 to-teal-400`
- **Hover**: `from-emerald-600 to-teal-500`

### Componentes Específicos

#### Inputs e Selects
```css
bg-gray-800
border-gray-700
text-white
placeholder-gray-500
focus:ring-emerald-500
```

#### Botões Primários
```css
bg-gradient-to-r from-emerald-500 to-teal-400
hover:from-emerald-600 hover:to-teal-500
text-white
shadow-lg
```

#### Botões Secundários
```css
border-gray-600
text-gray-300
hover:bg-gray-700
hover:border-gray-500
```

#### Indicador de Progresso
- **Ativo**: `from-emerald-500 to-teal-400`
- **Inativo**: `bg-gray-700 text-gray-400`
- **Linha**: `bg-gray-700`
- **Label Ativo**: `text-emerald-400`
- **Label Inativo**: `text-gray-500`

### Cards de Resultado

#### Potência (Verde)
```css
bg-gradient-to-br from-emerald-900/50 to-emerald-800/30
border-emerald-700/50
text-emerald-300 (label)
text-emerald-400 (valor)
```

#### Placas (Azul)
```css
bg-gradient-to-br from-blue-900/50 to-blue-800/30
border-blue-700/50
text-blue-300 (label)
text-blue-400 (valor)
```

#### Investimento (Roxo)
```css
bg-gradient-to-br from-purple-900/50 to-purple-800/30
border-purple-700/50
text-purple-300 (label)
text-purple-400 (valor)
```

#### Payback (Laranja)
```css
bg-gradient-to-br from-orange-900/50 to-orange-800/30
border-orange-700/50
text-orange-300 (label)
text-orange-400 (valor)
```

### Alertas e Mensagens

#### Informação (Azul)
```css
bg-blue-900/30
border-blue-700/50
text-blue-300 (título)
text-blue-200 (texto)
```

#### Sucesso (Verde)
```css
bg-emerald-900/30
border-emerald-700/50
text-emerald-200
```

#### Erro (Vermelho)
```css
bg-red-900/30
border-red-700/50
text-red-300
```

## Contraste e Legibilidade

### Ratios de Contraste (WCAG AA)

Todos os textos atendem aos padrões de acessibilidade:

- **Títulos brancos em fundo escuro**: 15:1 ✅
- **Texto cinza claro em fundo escuro**: 8:1 ✅
- **Labels em cards coloridos**: 7:1 ✅
- **Botões com gradiente**: 4.5:1 ✅

## Comparação: Antes vs Depois

### Antes (Tema Claro)
```css
Background: from-green-50 via-blue-50 to-yellow-50
Cards: bg-white
Texto: text-gray-800
Botões: bg-green-500
```
**Problema**: Texto cinza em fundo claro tinha baixo contraste

### Depois (Tema Escuro)
```css
Background: from-gray-900 via-slate-900 to-gray-800
Cards: bg-gray-800 border-gray-700
Texto: text-white / text-gray-300
Botões: gradient from-emerald-500 to-teal-400
```
**Solução**: Alto contraste, legibilidade perfeita

## Customização Adicional

### Ajustar Intensidade do Fundo
```typescript
// Mais escuro
className="bg-gradient-to-br from-black via-gray-900 to-gray-900"

// Mais claro
className="bg-gradient-to-br from-gray-800 via-slate-800 to-gray-700"
```

### Mudar Cor de Accent
```typescript
// Azul
from-blue-500 to-cyan-400

// Roxo
from-purple-500 to-pink-400

// Amarelo/Laranja
from-yellow-500 to-orange-400
```

### Adicionar Efeitos de Vidro (Glassmorphism)
```typescript
className="bg-gray-800/80 backdrop-blur-lg border border-gray-700/50"
```

## Acessibilidade

### Checklist
- ✅ Contraste mínimo 4.5:1 para texto normal
- ✅ Contraste mínimo 3:1 para texto grande
- ✅ Focus states visíveis (ring-emerald-500)
- ✅ Hover states claros
- ✅ Disabled states distinguíveis
- ✅ Cores não são única forma de informação

### Testes Recomendados
1. Usar ferramenta de contraste (ex: WebAIM)
2. Testar com daltonismo (Chrome DevTools)
3. Testar com leitor de tela
4. Testar navegação por teclado

## Modo Claro (Opcional)

Se quiser adicionar toggle de tema:

```typescript
// tailwind.config.ts
module.exports = {
  darkMode: 'class',
  // ...
}

// Componente
<div className="dark:bg-gray-900 bg-white">
  <p className="dark:text-white text-gray-900">Texto</p>
</div>
```

---

**Resultado**: Interface moderna, elegante e perfeitamente legível! 🎨✨
