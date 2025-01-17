import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
      fullname:{
            type:String,
            required:true
      },
      email:{
            type:String,
            required:true,
            unique:true
      },
      phonenumber:{
            type:Number,
            required:true
      },
      password:{
            type:String,
            required:true
      },
      role:{
            type:String,
            enum:['Student','Recruiter'],
            required:true
      },
      profile:{
            bio:{type:String},
            skills:[{type:String}],
            resume:{type:String},//resume link forlder
            resumeOriginalName:{type:String},
            company:{type:mongoose.Schema.Types.ObjectId,ref:'company'},
            profilePhoto:{
                  type:String,
                  default:""
            }
      },
      token:{
         type:String
      }
},{timestamps:true})

export const User = mongoose.model('User',UserSchema)