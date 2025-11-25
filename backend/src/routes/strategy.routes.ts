import { Router } from 'express';
import multer from 'multer';
import { authenticateToken } from '../middleware/auth.middleware';
import { getStrategies, getStrategyById, uploadStrategy, updateStrategy, deleteStrategy } from '../controllers/strategy.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(authenticateToken);

router.get('/portfolio/:portfolioId', getStrategies);
router.get('/:id', getStrategyById);
router.post('/portfolio/:portfolioId/upload', upload.fields([
    { name: 'backtest', maxCount: 1 },
    { name: 'realtime', maxCount: 1 }
]), uploadStrategy);
router.put('/:id', updateStrategy);
router.delete('/:id', deleteStrategy);

export default router;
