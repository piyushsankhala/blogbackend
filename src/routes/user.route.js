import express from 'express';
import { Router } from 'express';
import { authmiddleware } from '../middlewares/auth.middleware';

import { registeruser,loginuser,logout,refreshacesstoken } from '../controllers/user.controller';

const route = Router()

route.post("/register",registeruser) 
route.post("/login",loginuser)

route.get("logout",authmiddleware ,logout)

route.get("/refresh", refreshacesstoken)

export {route}

