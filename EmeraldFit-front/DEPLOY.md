# Emerald Fit - Deploy no Vercel

## 🚀 Como fazer deploy

### 1. Instale o Vercel CLI (opcional)
```bash
npm i -g vercel
```

### 2. Deploy via Vercel CLI
```bash
cd front
vercel
```

### 3. Ou use o Dashboard da Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Add New Project"
3. Importe seu repositório do GitHub
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `front`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Clique em "Deploy"

## ⚙️ Variáveis de Ambiente

Configure no dashboard da Vercel:

### Production
- `VITE_API_URL`: URL da sua API de produção

### Development
- `VITE_API_URL`: URL da API de desenvolvimento

## 📝 Notas
- O arquivo `vercel.json` já está configurado para SPA routing
- PWA funcionará automaticamente após o build
- Certifique-se de que os ícones PWA (pwa-192x192.png e pwa-512x512.png) estão na pasta `public`
