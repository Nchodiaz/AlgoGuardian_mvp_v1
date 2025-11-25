import { Router } from 'express';
import { updatePlan, updatePaymentMethod, getInvoices, recordUpgradeAttempt } from '../controllers/subscription.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.put('/plan', authenticateToken, updatePlan);
router.put('/payment-method', authenticateToken, updatePaymentMethod);
router.get('/invoices', authenticateToken, getInvoices);
router.post('/upgrade-attempt', authenticateToken, recordUpgradeAttempt);

export default router;
