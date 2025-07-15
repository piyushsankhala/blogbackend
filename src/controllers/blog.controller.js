import express from 'express';
import { Blog } from '../models/blog.model.js'
import { uploadOnCloudinary } from '../utils/cloundinary.js';

const getallblogs = async(req,res)=>{
    try{
       const blogs = await Blog.find().sort({ createdAt: -1 }).populate("user");

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
            const blog = await Blog.findById(blogid).populate('user')
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
            return res.status(201).json({updatedBlog : blog})
    }catch(error){
        console.error(error)
        return res.status(500).json({message : "Error toggling likes" });
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
const getpostofuser = async(req,res)=>{
  try{
    const {userid} = req.body
    if(!userid){
      return res.status(400).json({message:"user id is not provided"})
    }
    const blogs = await Blog.find({user : userid}).populate('user')
    if(!blogs){
        return res.status(400).json({message : "blogs not found"})
    }
    return res.status(200).json({blogs : blogs})
  }catch(err){
    return res.status(500).json({message : "Internal server error"})
  }
}


const deleteBlog = async (req, res) => {
  try {
    const { blogid } = req.body;
    const currentUserId = req.user?._id;

    if (!blogid) {
      return res.status(400).json({ message: "Blog ID is required" });
    }

    const blog = await Blog.findById(blogid);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Optional: only allow owner to delete
    if (blog.user.toString() !== currentUserId.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this blog" });
    }

    await blog.deleteOne();

    return res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
const editpost =async(req,res)=>{
    try{
        const {blogid , content } = req.body
        const image = req.file?.path
        if(!blogid){
            return res.status(400).json({message : "blog id is not provided"})
        }
        if(image){
            const imageuploaded = await uploadOnCloudinary(image)
            const blog = await Blog.findByIdAndUpdate(blogid,{
            content : content,
            image : imageuploaded.url,

        })
            
        }
        else{
            const blog = await Blog.findByIdAndUpdate(blogid,{
                content : content,
                })
        }
        return res.status(200).json({message : "blog updated successfully"})

    }catch(err){
        console.error(err)
        return res.status(500).json({message : "Internal server error",err})
    }
}



export {getallblogs,getblogofexistinguser,togglelikes,uploadblog,getpostofuser,deleteBlog , editpost}