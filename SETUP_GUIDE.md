# AlgoGuardian - Complete Setup Guide

## Quick Start

### 1. Backend Setup

#### A. Database (Neon PostgreSQL)
1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project (name it "algoguardian")
3. Copy the connection string from the dashboard
4. Create `backend/.env`:
```bash
DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="your-super-secret-jwt-key-change-this-to-random-string"
GEMINI_API_KEY="your-gemini-api-key-optional"
PORT=3000
NODE_ENV=development
```

#### B. Install & Run Backend
```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

The backend will run on `http://localhost:3000`

### 2. Frontend Setup

#### A. Configure API URL
Create `.env` in the root directory:
```bash
VITE_API_URL=http://localhost:3000/api
```

#### B. Install & Run Frontend
```bash
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

### 3. Test the Application

1. Open `http://localhost:5173` in your browser
2. Click "Get Started" and create an account
3. Create a portfolio (e.g., "My Trading Strategies")
4. Upload the sample files:
   - Backtest: `BackTest_file_ejemplo.csv`
   - Real-time: `RealTime_file_ejemplo.csv`
5. View the analyzed strategy!

## Production Deployment

### Option 1: Railway (Recommended)

#### Backend:
1. Push your code to GitHub
2. Go to [railway.app](https://railway.app)
3. Create new project → Deploy from GitHub
4. Select your repository
5. Add environment variables in Railway dashboard:
   - `DATABASE_URL` (from Neon)
   - `JWT_SECRET`
   - `GEMINI_API_KEY` (optional)
   - `NODE_ENV=production`
6. Set root directory to `backend`
7. Railway will auto-deploy

#### Frontend:
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Framework: Vite
4. Root directory: `.` (root)
5. Add environment variable:
   - `VITE_API_URL=https://your-backend-url.railway.app/api`
6. Deploy!

### Option 2: All-in-One (Render)

1. Create account on [render.com](https://render.com)
2. Create PostgreSQL database (free tier)
3. Create Web Service for backend:
   - Build: `cd backend && npm install && npm run prisma:generate && npm run build`
   - Start: `cd backend && npm start`
4. Create Static Site for frontend:
   - Build: `npm install && npm run build`
   - Publish: `dist`

## Troubleshooting

### Backend won't start
- Check if PostgreSQL connection string is correct
- Run `npm run prisma:generate` again
- Check if port 3000 is available

### Frontend can't connect to backend
- Verify `.env` has correct `VITE_API_URL`
- Check browser console for CORS errors
- Ensure backend is running

### File upload fails
- Check file format (CSV or TXT)
- Ensure files contain required columns (profit, close time)
- Check backend logs for detailed error

## API Documentation

See `backend/README.md` for detailed API endpoint documentation.

## Support

For issues, check the console logs (browser and backend terminal) for error messages.
