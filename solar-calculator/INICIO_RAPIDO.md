# 🚀 Início Rápido

## Passo 1: Instalar Dependências
```bash
cd solar-calculator
npm install
```

## Passo 2: Configurar API Key do Gemini

1. Acesse: https://makersuite.google.com/app/apikey
2. Crie uma API Key gratuita
3. Copie o arquivo de exemplo:
```bash
cp .env.example .env.local
```
4. Edite `.env.local` e cole sua chave:
```
GEMINI_API_KEY=sua_chave_aqui
```

## Passo 3: Executar o Projeto
```bash
npm run dev
```

## Passo 4: Acessar
Abra seu navegador em: http://localhost:3000

## 🎯 Testando a Aplicação

1. **Etapa 1 - Localização**
   - Cidade: São Paulo
   - Estado: SP
   - CEP: 01310-100 (opcional)

2. **Etapa 2 - Consumo**
   - Consumo: 350 kWh

3. **Etapa 3 - Expansão**
   - Pretende aumentar: Sim
   - Adicione equipamentos:
     - 2x Ar Condicionado (1500W, 8h/dia)
     - 1x Chuveiro Elétrico (5500W, 1h/dia)

4. **Etapa 4 - Revisão**
   - Revise os dados
   - Clique em "Gerar Orçamento"

5. **Resultado**
   - Visualize os cálculos da IA
   - Baixe o PDF

## ⚠️ Problemas Comuns

### Erro: "API Key inválida"
- Verifique se a chave está correta no `.env.local`
- Reinicie o servidor (`Ctrl+C` e `npm run dev`)

### Erro ao gerar PDF
- Verifique se o jsPDF foi instalado corretamente
- Execute: `npm install jspdf`

### Erro de CORS
- Certifique-se de estar acessando via `localhost:3000`
- Não use `127.0.0.1`

## 📦 Build para Produção

```bash
npm run build
npm run start
```

## 🌐 Deploy na Vercel

1. Faça push para o GitHub
2. Importe no Vercel
3. Adicione a variável de ambiente `GEMINI_API_KEY`
4. Deploy!

---

Pronto! Sua aplicação está funcionando! 🎉
