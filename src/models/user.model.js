import mongoose,{Schema} from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userschema = new Schema({
    username : {
        type : String,
        unique : true,
        required : true,
        trim : true


    },
    gmail : {
        type : String ,
        unique : true ,
        required : true ,
        trim : true
        

    },
    password : {
        type : String ,
        required : true ,
        trim : true,
        minlength : 8 ,


    },
    refreshtoken :{
        type : String ,
        

    }



})

userschema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next()
    }
    await bcrypt.hash(this.password , 10)
    next();
})

userschema.methods.isvalidpassword = async function(password){
    return await bcrypt.compare(password , this.password)
    }

userschema.methods.getaccesstoken = async function(){
    const token = jwt.sign({id : this._id} , process.env.ACCESS_SECRET_KEY,{expiresIn : "1h"})
    return token ;
}

userschema.methods.getrefreshtoken = async function () {
    return jwt.sign({id : this._id},process.env.REFRESH_SECRET_KEY,{expiresIn:"3d"});
    
}

const User = mongoose.model("User", userschema);
export {User}
