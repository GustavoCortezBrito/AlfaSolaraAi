# 🧪 Como Testar a Aplicação

## Pré-requisitos

1. ✅ Node.js instalado (versão 18+)
2. ✅ Dependências instaladas (`npm install`)
3. ✅ API Key do Gemini configurada no `.env.local`
4. ✅ Servidor rodando (`npm run dev`)

## 🎯 Cenários de Teste

### Teste 1: Fluxo Básico (Sem Expansão)

**Objetivo**: Testar o fluxo mais simples

1. Acesse http://localhost:3000
2. **Etapa 1 - Localização**:
   - Cidade: `São Paulo`
   - Estado: `SP`
   - Clique em "Próximo"

3. **Etapa 2 - Consumo**:
   - Consumo: `350`
   - Clique em "Próximo"

4. **Etapa 3 - Expansão**:
   - Selecione: `Não`
   - Clique em "Próximo"

5. **Etapa 4 - Revisão**:
   - Verifique os dados
   - Clique em "Gerar Orçamento"

6. **Resultado**:
   - ✅ Deve exibir os cálculos
   - ✅ Valores devem ser coerentes
   - ✅ Clique em "Baixar PDF"
   - ✅ PDF deve ser baixado

**Resultado Esperado**:
- Potência: ~3-4 kWp
- Placas: 6-8 unidades
- Custo: R$ 13.000 - R$ 18.000
- Payback: 3-5 anos

---

### Teste 2: Fluxo Completo (Com Expansão)

**Objetivo**: Testar com equipamentos adicionais

1. **Etapa 1 - Localização**:
   - Cidade: `Belo Horizonte`
   - Estado: `MG`
   - CEP: `30130-000`

2. **Etapa 2 - Consumo**:
   - Consumo: `450`

3. **Etapa 3 - Expansão**:
   - Selecione: `Sim`
   - Clique em "+ Adicionar"
   - **Equipamento 1**:
     - Tipo: `Ar Condicionado`
     - Potência: `1500` (preenchido automaticamente)
     - Quantidade: `2`
     - Horas/dia: `8`
   - Clique em "+ Adicionar"
   - **Equipamento 2**:
     - Tipo: `Chuveiro Elétrico`
     - Potência: `5500`
     - Quantidade: `1`
     - Horas/dia: `1`

4. **Etapa 4 - Revisão**:
   - Verifique consumo adicional calculado
   - Gere o orçamento

**Resultado Esperado**:
- Consumo total: ~735 kWh
- Potência: ~9-10 kWp
- Placas: 16-18 unidades
- Custo: R$ 38.000 - R$ 45.000

---

### Teste 3: Validações

**Objetivo**: Testar validações de campos

1. **Etapa 1**:
   - Tente avançar sem preencher cidade
   - ✅ Botão deve estar desabilitado
   - Tente avançar sem selecionar estado
   - ✅ Botão deve estar desabilitado

2. **Etapa 2**:
   - Tente avançar com consumo = 0
   - ✅ Botão deve estar desabilitado
   - Digite consumo negativo
   - ✅ Deve aceitar apenas valores positivos

3. **Etapa 3**:
   - Selecione "Sim" para expansão
   - Adicione equipamento
   - Deixe campos vazios
   - ✅ Botão "Próximo" deve estar desabilitado

---

### Teste 4: Navegação

**Objetivo**: Testar navegação entre etapas

1. Preencha até a Etapa 3
2. Clique em "← Voltar"
3. ✅ Deve voltar para Etapa 2
4. ✅ Dados devem estar preservados
5. Avance novamente
6. ✅ Dados devem continuar lá

---

### Teste 5: Responsividade

**Objetivo**: Testar em diferentes tamanhos de tela

1. **Desktop** (1920x1080):
   - ✅ Layout deve estar centralizado
   - ✅ Formulário com largura máxima
   - ✅ Cards lado a lado

2. **Tablet** (768x1024):
   - ✅ Layout deve se adaptar
   - ✅ Cards em 2 colunas

3. **Mobile** (375x667):
   - ✅ Layout em coluna única
   - ✅ Botões em largura total
   - ✅ Texto legível

**Como testar**:
- Pressione F12 no navegador
- Clique no ícone de dispositivo móvel
- Teste diferentes resoluções

---

### Teste 6: Animações

**Objetivo**: Verificar animações suaves

1. Navegue entre as etapas
2. ✅ Transições devem ser suaves
3. ✅ Indicador de progresso deve animar
4. ✅ Campos devem aparecer com fade-in

---

### Teste 7: Geração de PDF

**Objetivo**: Verificar qualidade do PDF

1. Gere um orçamento completo
2. Baixe o PDF
3. Abra o arquivo
4. Verifique:
   - ✅ Cabeçalho verde com título
   - ✅ Dados do cliente corretos
   - ✅ Dimensionamento completo
   - ✅ Valores formatados (R$)
   - ✅ Análise técnica legível
   - ✅ Rodapé com validade

---

### Teste 8: Tratamento de Erros

**Objetivo**: Testar comportamento com erros

1. **Sem API Key**:
   - Remova a API Key do `.env.local`
   - Reinicie o servidor
   - Tente gerar orçamento
   - ✅ Deve exibir mensagem de erro

2. **API Key Inválida**:
   - Coloque uma chave inválida
   - Tente gerar orçamento
   - ✅ Deve exibir erro apropriado

3. **Sem Internet**:
   - Desconecte a internet
   - Tente gerar orçamento
   - ✅ Deve exibir erro de conexão

---

### Teste 9: Performance

**Objetivo**: Verificar velocidade

1. Abra DevTools (F12)
2. Vá para aba "Network"
3. Gere um orçamento
4. Verifique:
   - ✅ Resposta da API em < 10 segundos
   - ✅ PDF gerado em < 2 segundos
   - ✅ Sem erros no console

---

### Teste 10: Múltiplos Orçamentos

**Objetivo**: Testar geração sequencial

1. Gere um orçamento
2. Clique em "Novo Orçamento"
3. ✅ Formulário deve estar limpo
4. ✅ Deve voltar para Etapa 1
5. Gere outro orçamento diferente
6. ✅ Deve funcionar normalmente

---

## 🐛 Problemas Comuns e Soluções

### Erro: "Failed to fetch"
**Causa**: Servidor não está rodando
**Solução**: Execute `npm run dev`

### Erro: "API Key inválida"
**Causa**: Chave não configurada ou incorreta
**Solução**: 
1. Verifique `.env.local`
2. Reinicie o servidor
3. Obtenha nova chave em https://makersuite.google.com/app/apikey

### PDF não baixa
**Causa**: Bloqueador de pop-ups
**Solução**: Permita downloads no navegador

### Animações travadas
**Causa**: Performance do dispositivo
**Solução**: Normal em dispositivos mais lentos

### Valores estranhos nos cálculos
**Causa**: Resposta inesperada da IA
**Solução**: 
1. Verifique o console
2. Tente novamente
3. Ajuste o prompt se necessário

---

## ✅ Checklist de Testes

Antes de considerar a aplicação pronta:

- [ ] Teste 1: Fluxo básico funciona
- [ ] Teste 2: Fluxo com expansão funciona
- [ ] Teste 3: Validações funcionam
- [ ] Teste 4: Navegação preserva dados
- [ ] Teste 5: Responsivo em mobile
- [ ] Teste 6: Animações suaves
- [ ] Teste 7: PDF gerado corretamente
- [ ] Teste 8: Erros tratados adequadamente
- [ ] Teste 9: Performance aceitável
- [ ] Teste 10: Múltiplos orçamentos funcionam

---

## 📊 Dados de Teste Sugeridos

### Cenário Residencial Pequeno
- Cidade: Curitiba, PR
- Consumo: 250 kWh
- Sem expansão

### Cenário Residencial Médio
- Cidade: Rio de Janeiro, RJ
- Consumo: 400 kWh
- 1x Ar Condicionado (1500W, 6h/dia)

### Cenário Residencial Grande
- Cidade: Brasília, DF
- Consumo: 600 kWh
- 3x Ar Condicionado (1500W, 8h/dia)
- 1x Piscina (1000W, 4h/dia)
- 1x Chuveiro Elétrico (5500W, 1h/dia)

### Cenário Extremo
- Cidade: Fortaleza, CE
- Consumo: 800 kWh
- 4x Ar Condicionado (1500W, 10h/dia)
- 1x Veículo Elétrico (7000W, 2h/dia)
- 2x Chuveiro Elétrico (5500W, 1h/dia)

---

## 🎯 Critérios de Sucesso

A aplicação está funcionando corretamente se:

1. ✅ Todos os 10 testes passam
2. ✅ Não há erros no console
3. ✅ Cálculos são coerentes
4. ✅ PDF é gerado corretamente
5. ✅ Interface é responsiva
6. ✅ Animações são suaves
7. ✅ Erros são tratados
8. ✅ Performance é aceitável

---

**Boa sorte com os testes! 🚀**
