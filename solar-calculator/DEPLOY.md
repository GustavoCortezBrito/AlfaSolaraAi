# 🚀 Guia de Deploy

## Deploy na Vercel (Recomendado)

A Vercel é a plataforma oficial do Next.js e oferece deploy gratuito.

### Passo a Passo

1. **Criar conta na Vercel**
   - Acesse: https://vercel.com
   - Faça login com GitHub

2. **Preparar o repositório**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/seu-usuario/solar-calculator.git
   git push -u origin main
   ```

3. **Importar projeto na Vercel**
   - Clique em "New Project"
   - Selecione seu repositório
   - Configure as variáveis de ambiente

4. **Configurar variáveis de ambiente**
   - Adicione: `GEMINI_API_KEY`
   - Cole sua chave da API do Gemini
   - Clique em "Deploy"

5. **Pronto!**
   - Seu site estará no ar em segundos
   - URL: `https://seu-projeto.vercel.app`

### Deploy Automático
Toda vez que você fizer push para o GitHub, a Vercel fará deploy automático!

---

## Deploy na Netlify

### Passo a Passo

1. **Criar conta na Netlify**
   - Acesse: https://netlify.com
   - Faça login com GitHub

2. **Instalar Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

3. **Build do projeto**
   ```bash
   npm run build
   ```

4. **Deploy**
   ```bash
   netlify deploy --prod
   ```

5. **Configurar variáveis**
   - No painel da Netlify
   - Site settings > Environment variables
   - Adicione `GEMINI_API_KEY`

---

## Deploy em VPS (DigitalOcean, AWS, etc.)

### Requisitos
- Node.js 18+
- PM2 (gerenciador de processos)
- Nginx (proxy reverso)

### Passo a Passo

1. **Conectar ao servidor**
   ```bash
   ssh usuario@seu-servidor.com
   ```

2. **Instalar Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clonar repositório**
   ```bash
   git clone https://github.com/seu-usuario/solar-calculator.git
   cd solar-calculator
   ```

4. **Instalar dependências**
   ```bash
   npm install
   ```

5. **Configurar variáveis de ambiente**
   ```bash
   nano .env.local
   # Adicione: GEMINI_API_KEY=sua_chave
   ```

6. **Build**
   ```bash
   npm run build
   ```

7. **Instalar PM2**
   ```bash
   sudo npm install -g pm2
   ```

8. **Iniciar aplicação**
   ```bash
   pm2 start npm --name "solar-calculator" -- start
   pm2 save
   pm2 startup
   ```

9. **Configurar Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/solar-calculator
   ```

   Adicione:
   ```nginx
   server {
       listen 80;
       server_name seu-dominio.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   sudo ln -s /etc/nginx/sites-available/solar-calculator /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

10. **SSL com Let's Encrypt**
    ```bash
    sudo apt install certbot python3-certbot-nginx
    sudo certbot --nginx -d seu-dominio.com
    ```

---

## Deploy no Docker

### Dockerfile

Crie `Dockerfile` na raiz:

```dockerfile
FROM node:18-alpine AS base

# Dependências
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Produção
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  solar-calculator:
    build: .
    ports:
      - "3000:3000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    restart: unless-stopped
```

### Comandos

```bash
# Build
docker-compose build

# Executar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

---

## Checklist Pré-Deploy

- [ ] Testar localmente com `npm run build && npm start`
- [ ] Verificar se `.env.local` não está no Git
- [ ] Configurar variáveis de ambiente na plataforma
- [ ] Testar todas as funcionalidades
- [ ] Verificar responsividade mobile
- [ ] Testar geração de PDF
- [ ] Verificar integração com Gemini
- [ ] Configurar domínio personalizado (opcional)
- [ ] Configurar SSL/HTTPS
- [ ] Configurar analytics (opcional)

---

## Monitoramento

### Vercel Analytics
Adicione em `app/layout.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Google Analytics
```typescript
// app/layout.tsx
<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
  strategy="afterInteractive"
/>
```

---

## Troubleshooting

### Erro: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro: "API Key inválida"
- Verifique se a variável está configurada corretamente
- Reinicie o servidor/container

### Erro 500 em produção
- Verifique os logs
- Confirme que todas as dependências estão instaladas
- Verifique se o build foi bem-sucedido

---

Escolha a plataforma que melhor se adequa às suas necessidades! 🚀
