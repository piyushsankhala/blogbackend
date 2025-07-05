import express from 'express';
import {User} from './models/User.js';

const registeruser = async (req ,res) => {
    try{
            const {username , email , password}= req.body;
            if(!username || !email || !password){
                return res.status(400).json({message : "Please fill in all fields"});
            }
            const existingUser = await User.findOne({$Or : [{username , email}]});
            if(existingUser){
                return res.status(400).json({message : "Email or username already in use"});
            }

            User.create({
                username , email , password

            })
            return res.status(201).json({message : "user created successfully"})
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message : "Internal server error"});
    }



}

const loginuser = async()=>{
    try{
        const {username , email , password} =req.body
        if(!username ||!email || !password){
            return res.status(400).json({
                message : "please provide email, username and password"
            })
            const existinguser = User.findOne({$all : [{username , email}]})
            if(!existinguser){
                return res.status(400).json({message : "no user with such credentials exists"})
            }
                }
            const refreshtoken = existinguser.getrefreshtoken();
            const acesstoken = existinguser.getaccesstoken();
            existinguser.refreshtoken = refreshtoken
            await existinguser.save()
            return res.status(201).cookie("acesstoken",acesstoken,{httpOnly : true , secure : false , sameSite : "None"}).cookie("refreshtoken", refreshtoken, {httpOnly:true , secure : false , sameSite : "None"}).json({message : "logged in successfully"})
            }
            catch(error){
                console.log(error);
                return res.status(500).json({message : "Internal server error"});
            }

}

const logout = async(req,res)=>{
    try{
        return res.clearCookie("acesstoken", acesstoken,{httpOnly:true , secure:false , sameSite :"None"}).clearCookie("refreshtoken", refreshtoken, {httpOnly:true , secure:false , sameSite :"None"}).json({message : "logged out successfully"})
    }catch(error){
        console.error(error);
        return res.status(500).json({message : "Internal server error"});

    }


}

const refreshacesstoken = async(req,res)=>{
    try{
        const refreshtoken = req.cookies.refreshtoken
        if(!refreshtoken){
            return res.status(400).json({message : "Please login first"})
            }
        const existingUser = User.findOne({refreshtoken})
        if(!existingUser){
            return res.status(400).json({message : "no user found"})
        }
        const accesstoken = existingUser.getaccesstoken()
        const newrefreshtoken = existingUser.getrefreshtoken()
        existingUser.refreshtoken = newrefreshtoken
        await existingUser.save()
        return res.status(201).cookie("acesstoken", accesstoken, {httpOnly:true , secure: false , sameSite :"None"}).cookie("refreshtoken",newrefreshtoken,{httpOnly:true,secure : false , sameSite : "None"})

}catch(error){
    console.error(error);
    return res.status(500).json({message : "Internal server error"});
}
}
export {registeruser,loginuser,refreshacesstoken,logout}

