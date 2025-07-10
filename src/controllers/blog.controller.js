import express from 'express';
import { Blog } from '../models/blog.model.js'
import { uploadOnCloudinary } from '../utils/cloundinary.js';

const getallblogs = async(req,res)=>{
    try{
        const blogs = await Blog.find().populate('user').populate('likes');
        return res.status(200).json({blogs : blogs});

    }catch(error){
        console.error(error)
        return res.status(500).json({message : "Error fetching blogs"});
    }
}

const getblogofexistinguser = async(req,res)=>{
    try{
        const currentuserid = req.user?._id 
        if(!currentuserid){
            return res.status(401).json({message : "Unauthorized"});

        }
        const blogs = await Blog.find({user : currentuserid}).populate('user').populate('likes');
        return res.status(200).json({blogs : blogs});

    }catch(error){
        console.error(error)
        return res.status(500).json({message : "Error fetching blogs"});
    }
}

const togglelikes = async(req,res)=>{
    try{
        const {blogid} = req.body
        const currentuserid = req.user?._id
        if(!currentuserid){
            return res.status(401).json({message : "Unauthorized"});
            }
            const blog = await Blog.findById(blogid);
            if(!blog){
                return res.status(404).json({message : "Blog not found"});
                }

            const hasliked = blog.likes.includes(currentuserid)
            if(hasliked){
                blog.likes.pull(currentuserid)
            }
            else{
                blog.likes.push(currentuserid)
            }
            await blog.save()
    }catch(error){
        console.error(error)
        return res.status(500).json({message : "Error toggling likes"});
    }
}

const uploadblog = async(req,res)=>{
    try{
        const {content} = req.body
        const image= req.file?.path
        const imageuploaded = await uploadOnCloudinary(image)
        const currentuserid = req.user?._id
        if(!currentuserid){
            return res.status(401).json({message : "Unauthorized"});
            }
       const blog =   await Blog.create({
            content : content,
            user : currentuserid,
            image : imageuploaded.url

        })
        return res.status(201).json({message : "Blog uploaded successfully", blog:blog});

    }catch(error){
        console.error(error)
        return res.status(500).json({message:"internal  server error"})
    }
}
export {getallblogs,getblogofexistinguser,togglelikes,uploadblog}