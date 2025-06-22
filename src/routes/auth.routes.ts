import { Router } from "express";
import { getMeHandler, loginHandler, refreshHandler, registerHandler } from '../controllers/auth.controller.js';
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

router.post('/register',registerHandler);
router.post('/login',loginHandler);

// Protected Route
router.get('/me',authenticateToken,getMeHandler);

router.post('/refresh',refreshHandler);

export default router;