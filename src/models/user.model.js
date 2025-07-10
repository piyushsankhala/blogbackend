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
    email : {
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
   this.password =  await bcrypt.hash(this.password , 10)
    next();
})

userschema.methods.isvalidpassword = async function(password){
    return await bcrypt.compare(password , this.password)
    }

userschema.methods.getaccesstoken =  function(){
    const token = jwt.sign({id : this._id} , process.env.ACCESS_KEY_SECRET,{expiresIn : "1h"})
    return token ;
}

userschema.methods.getrefreshtoken =  function () {
    return jwt.sign({id : this._id},process.env.REFRESH_KEY_SECRET,{expiresIn:"3d"});
    
}

const User = mongoose.model("User", userschema);
export {User}
