import express from 'express';
import { Router } from 'express';
import { authmiddleware } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/multer.middleware';
import { getallblogs, getblogofexistinguser, togglelikes, uploadblog } from '../controllers/blog.controller';

const router = Router()

router.post('/upload',authmiddleware,upload.single('image'),uploadblog)
router.get('/getallblogs',authmiddleware,getallblogs)
router.post('getblogofexsitinguser',authmiddleware,getblogofexistinguser)
router.post('togglelike',authmiddleware,togglelikes)

export {router}