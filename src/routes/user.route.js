import express from 'express';
import { Router } from 'express';
import { authmiddleware } from '../middlewares/auth.middleware.js';

import { registeruser,loginuser,logout,refreshacesstoken, currentuser, getallusers , countUnreadChats, allusers, getuser} from '../controllers/user.controller.js';

const route = Router()

route.post("/register",registeruser) 
route.post("/login",loginuser)

route.get("/logout",authmiddleware ,logout)
route.get("/currentuser",authmiddleware,currentuser)
route.post("/refresh", refreshacesstoken)
route.get('/getchatusers',authmiddleware,getallusers)
route.get("/unreadcount" , authmiddleware ,countUnreadChats )
route.get("/allusers",authmiddleware , allusers)
route.get('getuser', authmiddleware,getuser)
export default route;

