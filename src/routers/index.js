import { Router } from 'express';
import contactRouter from './contacts.js';
import authRouter from './auth.js';

const router = Router();

router.use('/api/contacts', contactRouter);
router.use('/api/auth', authRouter);

export default router;
