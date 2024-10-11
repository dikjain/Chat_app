import express from 'express';

import {registeruser,authUser ,updateUser,  allUsers} from '../controller/user.controller.js';
import protect from '../Middleware/authMiddleware.js';

const router = express.Router();

router.post("/",registeruser).get("/",protect,allUsers)
router.post("/login",authUser)
router.post("/update/:id",protect,updateUser)       





export default router
