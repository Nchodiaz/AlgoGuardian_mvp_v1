# AlgoGuardian Backend

Backend API for AlgoGuardian SaaS platform.

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Database (Neon PostgreSQL)

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy the connection string (it looks like: `postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`)
4. Create a `.env` file in the `backend/` directory:

```bash
cp .env.example .env
```

5. Edit `.env` and paste your database URL:

```env
DATABASE_URL="your-neon-connection-string-here"
JWT_SECRET="generate-a-random-secret-key-here"
GEMINI_API_KEY="your-gemini-api-key-if-available"
PORT=3000
NODE_ENV=development
```

### 3. Initialize Database

```bash
npm run prisma:generate
npm run prisma:migrate
```

This will create all tables (User, Portfolio, Strategy) in your Neon database.

### 4. Run Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login

### Portfolios (requires auth token)
- `GET /api/portfolios` - Get all portfolios
- `POST /api/portfolios` - Create portfolio
- `PUT /api/portfolios/:id` - Update portfolio
- `DELETE /api/portfolios/:id` - Delete portfolio

### Strategies (requires auth token)
- `GET /api/strategies/portfolio/:portfolioId` - Get strategies for portfolio
- `GET /api/strategies/:id` - Get strategy by ID
- `POST /api/strategies/portfolio/:portfolioId/upload` - Upload and analyze strategy files
- `PUT /api/strategies/:id` - Update strategy
- `DELETE /api/strategies/:id` - Delete strategy

## File Upload Format

The upload endpoint expects `multipart/form-data` with:
- `backtest`: Backtest report file (CSV/TXT)
- `realtime`: Real-time report file (CSV/TXT)
- `name`: Strategy name (optional)
- `symbol`: Trading symbol (optional)
- `timeframe`: Timeframe (optional)

## Production Deployment

For production deployment to Railway/Render:
1. Push code to GitHub
2. Connect repository to Railway/Render
3. Add environment variables in the platform dashboard
4. The app will auto-deploy

## Database Migrations

When you change the schema:
```bash
npm run prisma:migrate
```
