import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { getPortfolios, createPortfolio, updatePortfolio, deletePortfolio } from '../controllers/portfolio.controller';

const router = Router();

router.use(authenticateToken);

router.get('/', getPortfolios);
router.post('/', createPortfolio);
router.put('/:id', updatePortfolio);
router.delete('/:id', deletePortfolio);

export default router;
