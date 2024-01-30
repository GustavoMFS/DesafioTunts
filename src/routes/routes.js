import { Router } from 'express';
import authController from '../controllers/auth.js';
import * as spreadsheetController from '../controllers/SpreadsheetController.js';

const router = new Router();

router.get('/metadata', spreadsheetController.processSpreadsheet);
router.get('/auth', authController.getAuth);

export default router;