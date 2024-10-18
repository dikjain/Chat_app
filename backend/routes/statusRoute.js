import express from 'express';
import protect from '../Middleware/authMiddleware.js';

import {CreateStatus,fetchStatus,deleteStatus} from '../controller/status.controller.js';
const router = express.Router();

router.post("/",protect,CreateStatus)
router.post("/fetch",fetchStatus)
router.post("/delete",deleteStatus)





export default router