import express from 'express';
import { Router } from 'express';
import { authmiddleware } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
import { getallblogs, getblogofexistinguser, togglelikes, uploadblog ,getpostofuser, deleteBlog, editpost } from '../controllers/blog.controller.js';

const router = Router()

router.post('/upload',authmiddleware,upload.single('image'),uploadblog)
router.get('/getallblogs',authmiddleware,getallblogs)
router.get('/getblogofexistinguser',authmiddleware,getblogofexistinguser)
router.patch('/togglelike',authmiddleware,togglelikes)
router.post('/blogofuser',authmiddleware,getpostofuser)
router.delete('/deletepost', authmiddleware , deleteBlog)
router.post('/editpost',authmiddleware , upload.single('image') , editpost)
export default router