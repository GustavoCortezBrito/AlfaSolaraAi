# 🎨 Guia de Customização

## Cores e Tema

### Alterar Cores Principais
Edite `tailwind.config.ts` para mudar as cores do tema:

```typescript
theme: {
  extend: {
    colors: {
      primary: '#22c55e',    // Verde principal
      secondary: '#3b82f6',  // Azul secundário
      accent: '#f59e0b',     // Laranja de destaque
    }
  }
}
```

### Cores nos Componentes
As cores estão definidas usando classes do Tailwind:
- `bg-green-500` - Fundo verde
- `text-green-600` - Texto verde
- `border-green-200` - Borda verde clara

## Animações

### Velocidade das Animações
Em cada componente Step, ajuste o `duration`:

```typescript
transition={{ duration: 0.3 }}  // Mais rápido
transition={{ duration: 0.8 }}  // Mais lento
```

### Tipo de Animação
Altere o `initial` e `animate`:

```typescript
// Deslizar da direita
initial={{ opacity: 0, x: 50 }}
animate={{ opacity: 1, x: 0 }}

// Aparecer com zoom
initial={{ opacity: 0, scale: 0.8 }}
animate={{ opacity: 1, scale: 1 }}

// Aparecer de baixo
initial={{ opacity: 0, y: 50 }}
animate={{ opacity: 1, y: 0 }}
```

## Textos e Conteúdo

### Título Principal
Edite `app/page.tsx`:

```typescript
<h1 className="text-5xl font-bold text-gray-800 mb-4">
  Seu Título Aqui
</h1>
```

### Adicionar Logo
Em `app/page.tsx`, adicione antes do título:

```typescript
<img src="/logo.png" alt="Logo" className="h-20 mx-auto mb-4" />
```

## Equipamentos Adicionais

### Adicionar Novos Equipamentos
Edite `components/Step3Expansion.tsx`:

```typescript
const equipamentosComuns = [
  { nome: 'Ar Condicionado', potenciaWatts: 1500 },
  { nome: 'Seu Equipamento', potenciaWatts: 2000 },  // Adicione aqui
  // ...
];
```

## Cálculos da IA

### Ajustar Prompt da IA
Edite `app/api/calculate/route.ts` para modificar o comportamento da IA:

```typescript
const prompt = `
Você é um especialista em energia solar...

INSTRUÇÕES CUSTOMIZADAS:
- Use preços específicos da sua região
- Considere incentivos fiscais locais
- Ajuste as perdas do sistema conforme sua experiência

...
`;
```

### Alterar Modelo da IA
Troque o modelo do Gemini:

```typescript
const model = genAI.getGenerativeModel({ 
  model: 'gemini-pro'           // Padrão
  // model: 'gemini-1.5-pro'    // Mais avançado
});
```

## Layout do PDF

### Cores do PDF
Edite `app/api/generate-pdf/route.ts`:

```typescript
// Cabeçalho
doc.setFillColor(34, 197, 94);  // RGB: Verde
// Altere para suas cores

// Texto de destaque
doc.setTextColor(34, 197, 94);  // Verde
```

### Adicionar Logo no PDF
```typescript
// Após criar o doc
const imgData = 'data:image/png;base64,...';  // Sua logo em base64
doc.addImage(imgData, 'PNG', 15, 10, 30, 30);
```

### Informações da Empresa
Adicione no rodapé do PDF:

```typescript
doc.setFontSize(9);
doc.text('Sua Empresa Solar LTDA', 15, 280);
doc.text('contato@suaempresa.com | (11) 9999-9999', 15, 285);
doc.text('www.suaempresa.com', 15, 290);
```

## Validações

### Consumo Mínimo/Máximo
Em `components/Step2Consumption.tsx`:

```typescript
<input
  type="number"
  min="50"      // Consumo mínimo
  max="10000"   // Consumo máximo
  // ...
/>
```

### CEP Obrigatório
Em `components/Step1Location.tsx`:

```typescript
<input
  type="text"
  required      // Adicione esta linha
  // ...
/>
```

## Estados Brasileiros

### Adicionar Cidades Específicas
Em `components/Step1Location.tsx`:

```typescript
const cidadesPorEstado = {
  'SP': ['São Paulo', 'Campinas', 'Santos'],
  'RJ': ['Rio de Janeiro', 'Niterói'],
  // ...
};
```

## Responsividade

### Ajustar Breakpoints
As classes do Tailwind usam:
- `sm:` - 640px
- `md:` - 768px
- `lg:` - 1024px
- `xl:` - 1280px

Exemplo:
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  // 1 coluna mobile, 2 tablet, 3 desktop
</div>
```

## Adicionar Novos Campos

### Exemplo: Tipo de Telhado
1. Adicione ao tipo em `types/index.ts`:
```typescript
export interface FormData {
  // ... campos existentes
  tipoTelhado?: 'ceramico' | 'metalico' | 'laje';
}
```

2. Adicione campo no Step1:
```typescript
<select
  value={data.tipoTelhado || ''}
  onChange={(e) => onChange('tipoTelhado', e.target.value)}
>
  <option value="ceramico">Cerâmico</option>
  <option value="metalico">Metálico</option>
  <option value="laje">Laje</option>
</select>
```

3. Use no prompt da IA:
```typescript
const prompt = `
...
- Tipo de telhado: ${formData.tipoTelhado}
...
`;
```

## Integração com Backend Próprio

Se quiser usar seu próprio backend em vez das API Routes:

```typescript
// Em components/SolarForm.tsx
const response = await fetch('https://sua-api.com/calculate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
});
```

---

Essas customizações permitem adaptar a aplicação às suas necessidades específicas! 🎨
