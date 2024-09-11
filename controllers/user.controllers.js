import { User } from "../models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import getDataUri from "../utils/dataurl.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
   try {
      const { fullname, email, phonenumber, password, role } = req.body;

      // Check if all required fields are provided
      if (!fullname || !email || !phonenumber || !password || !role) {
         return res.status(400).json({
            message: "Something is missing",
            success: false
         });
      }

      // Check if a user already exists with the provided email
      const user = await User.findOne({ email });
      if (user) {
         return res.status(400).json({
            message: "User already exists with this email",
            success: false
         });
      }

      // Handle file upload (profile photo)
      let profilePhotoUrl = "";
      const file = req.file;
      if (file) {
         try {
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            profilePhotoUrl = cloudResponse.secure_url;
         } catch (error) {
            console.log("Cloudinary upload error:", error);
            return res.status(500).json({
               message: "Error uploading profile photo",
               success: false
            });
         }
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the user with or without a profile photo
      await User.create({
         fullname,
         email,
         phonenumber,
         password: hashedPassword,
         role,
         profile: {
            profilePhoto: profilePhotoUrl // Save the profile photo URL if available
         }
      });

      return res.status(201).json({
         message: "Account created successfully.",
         success: true
      });

   } catch (error) {
      console.log(error);
      return res.status(500).json({
         message: "Internal Server Error",
         success: false
      });
   }
}


export const login = async (req,res)=>{
      try {
            const {email,password,role} = req.body;

            console.log("Data check : " ,email,password,role);

            if(!email || !password || !role){
                  return res.status(400).json({
                        message:"something is missing",
                        success: false
                  })
            }

            let user = await User.findOne({email});
            if(!user){
                  return res.status(400).json({
                        message:"Incorrect email or password",
                        success:false
                  })
            }

            const isPaswword = await bcrypt.compare(password,user.password);

            if(!isPaswword){
                  return res.status(400).json({
                        message:"Incorrect email or password",
                        success:false
                  })
            }

            if(role !== user.role){
                  return res.status(400).json({
                        message:"Account doesn't exist with current role.",
                        success:false
                  })
            }
          const tokenData = {
            userID : user._id
          }
         const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
            expiresIn: "1d",
         });

         res.cookie("token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true,
            sameSite: "strict",
         });

         user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phonenumber: user.phonenumber,
            role: user.role,
            profile: user.profile,
            token: token
         };
          return res.status(200).json({
            message:`Welcome back ${user.fullname}`,
            user,
            success:true
          })


      } catch (error) {
            console.log(error)
      }
}

export const logout = async (req,res)=>{
      try {
            return res.status(200).cookie("token","",{maxAge:0}).json({
                  message:"logged out successfully.",
                  success:true
            })
            
      } catch (error) {
            console.log(error)
      }
}

export const updateprofile = async (req, res) => {
   try {
      const { fullname, email, phonenumber, bio, skills } = req.body;

      let skillsArray;
      if (skills) {
         skillsArray = skills.split(",");
      }

      const userId = req.id;
      const file = req.file;

      let cloudResponse;
      if (file) {
         // Cloudinary setup
         const fileUri = getDataUri(file);
         cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      }

      let user = await User.findById(userId);

      if (!user) {
         return res.status(400).json({
            message: "User not found.",
            success: false,
         });
      }

      // Update data
      if (fullname) user.fullname = fullname;
      if (email) user.email = email;
      if (phonenumber) user.phonenumber = phonenumber;
      if (bio) user.profile.bio = bio;
      if (skills) user.profile.skills = skillsArray;

      // Resume update
      if (cloudResponse) {
         user.profile.resume = cloudResponse.secure_url;
         user.profile.resumeOriginalName = file.originalname;
      }

      await user.save();

      user = {
         _id: user._id,
         fullname: user.fullname,
         email: user.email,
         phonenumber: user.phonenumber,
         role: user.role,
         profile: user.profile,
      };

      return res.status(200).json({
         message: "Profile updated successfully.",
         user,
         success: true,
      });
   } catch (error) {
      console.log(error);
      return res.status(500).json({
         message: "An error occurred while updating the profile.",
         success: false,
      });
   }
};
