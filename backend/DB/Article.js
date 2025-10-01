import mongoose from "mongoose"

const Articleschema = new mongoose.Schema({

         category:{type:String, required : true},
         subCategory:{type:String, required : true},
         title:{type:String, required : true},
         description:{type:String , required : true},

}, {timestamps:true}) ;

export default mongoose.model("Article" , Articleschema);