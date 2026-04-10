# Anshuman Portfolio

## Local Development

```bash
cd portfolio-app
npm install
npm run dev
```

Backend (separate):
```bash
cd server
npm install
npm start
```

## Deployment

Frontend: Vercel
Backend: Render or Vercel serverless

Set `VITE_API_URL` env var for production backend URL.

## Production Contact Form

1. Deploy backend (e.g., Render)
2. Set `VITE_API_URL=https://your-backend.onrender.com` in Vercel dashboard
3. Deploy frontend to Vercel
