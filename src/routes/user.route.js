import express from 'express';
import { Router } from 'express';
import { authmiddleware } from '../middlewares/auth.middleware.js';

import { registeruser,loginuser,logout,refreshacesstoken, currentuser } from '../controllers/user.controller.js';

const route = Router()

route.post("/register",registeruser) 
route.post("/login",loginuser)

route.get("logout",authmiddleware ,logout)
route.get("/currentuser",authmiddleware,currentuser)
route.post("/refresh", refreshacesstoken)

export default route;

