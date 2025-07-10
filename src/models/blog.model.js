import mongoose,{Schema} from "mongoose";
import { User } from "./user.model.js";
const blogschema = new Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',

    },
    content : {
        type : String,


    },
    image :{
        type : String,
    },
    likes : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }]
},{timestamps :true})

const Blog = mongoose.model('Blog', blogschema);
export {Blog}