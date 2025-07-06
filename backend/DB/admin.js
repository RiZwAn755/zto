import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name:{type:String , required:true },

    referrer:{type : String , required : [true , "Refferer name is required"],
        enum:{
            values:["Farhan" , "Ashish , Saurabh" , "Rizwan"],
            message:"Its not a valid referrer"
        }
    },
    
    email :{type:String , required : true},
    
    password : {type:String ,required:true}

}, {timestamps:true});

export default  mongoose.model("Admin", adminSchema);