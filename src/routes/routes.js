import { Router } from 'express';
import authController from '../controllers/auth.js';
import * as spreadsheetController from '../controllers/SpreadsheetController.js';

const router = new Router();

router.get('/metadata', spreadsheetController.processSpreadsheet); // Use the correct function name here
router.get('/auth', authController.getAuth);

export default router;