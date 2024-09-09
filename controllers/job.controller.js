import { Job } from "../models/job.model.js";
import {Application} from '../models/application.model.js'

//admin only
export const postJob = async (req,res)=>{
      try {
            const {title,description,requirements,salary,location,jobType,experience,position,companyId} = req.body;
            const userId = req.id;

            if(!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId){
                  return res.status(400).json({
                        message:"Something is missing.",
                        success:false
                  })
            }
            let requirementsArray;
            if(requirements){
               requirementsArray = requirements.split(",");
            }
            // console.log("Split array",requirementsArray);
            const job = await Job.create({
                  title,
                  description,
                  requirements:requirementsArray,
                  salary:Number(salary),
                  location,
                  jobType,
                  experienceLevel:experience,
                  position,
                  company:companyId,
                  created_by:userId
            })

            return res.status(200).json({
                  message:"New job created successfully.",
                  job,
                  success:true
            })

      } catch (error) {
            console.log(error);
      }
}

export const editJobPost = async (req, res) => {
   try {
      const jobId = req.params.id;

      // Destructure and validate input fields
      const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;

      // console.log(title, description, requirements, salary, location, jobType, experience, position, companyId);

      // Check for missing required fields
      if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
         return res.status(400).json({
            message: "Something is missing.",
            success: false
         });
      }
 
      // Parse and convert fields as necessary
      let requirementsArray = [];
      if (requirements) {
         try {
            // Convert requirements to an array, handling cases where it might already be an array
            requirementsArray = Array.isArray(requirements) ? requirements : requirements.split(",").map(req => req.trim());
         } catch (parseError) {
            return res.status(400).json({
               message: "Error parsing requirements. Please ensure it's a valid comma-separated string.",
               success: false
            });
         }
      }

      // Convert salary to a number, and check for valid number input
      const parsedSalary = Number(salary);
      if (isNaN(parsedSalary) || parsedSalary <= 0) {
         return res.status(400).json({
            message: "Invalid salary format. It should be a positive number.",
            success: false
         });
      }

      // Attempt to update the job post
      const updatedJob = await Job.findByIdAndUpdate(
         jobId,
         {
            title,
            description,
            requirements: requirementsArray,
            salary: parsedSalary,
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId
         },
         { new: true, runValidators: true } // Enforce validation when updating
      );

      // Check if the job was found and updated
      if (!updatedJob) {
         return res.status(404).json({
            message: "Job not found.",
            success: false
         });
      }

      // Successful response
      return res.status(200).json({
         message: "Job updated successfully.",
         job: updatedJob,
         success: true
      });

   } catch (error) {
      console.error("Error updating job:", error); // Log detailed error for debugging
      res.status(500).json({
         message: "Server error.",
         success: false
      });
   }
};



export const deleteJobPost = async (req, res) => {
   try {
      const jobId = req.params.id;

      // Delete all applications related to the job
      await Application.deleteMany({ job: jobId });

      // Delete the job post
      const deletedJob = await Job.findByIdAndDelete(jobId);

      if (!deletedJob) {
         return res.status(404).json({
            message: "Job not found.",
            success: false
         });
      }

      return res.status(200).json({
         message: "Job and associated applications deleted successfully.",
         success: true
      });

   } catch (error) {
      console.log(error);
      res.status(500).json({
         message: "Server error.",
         success: false
      });
   }
};





// students only
export const getAllJobs = async(req,res)=>{
      try {
          const keyword = req.query.keyword || "";
          const query = {
            $or:[
                  {title:{$regex:keyword,$options:"i"}},
                  {description:{$regex:keyword,$options:"i"}}
            ]
          };

          const jobs = await Job.find(query).populate({
            path:"company"
          }).sort({createdAt:-1});

          if(!jobs){
            return res.status(404).json({
                  message:"jobs not found.",
                  success:false
            })
          }
          return res.status(200).json({
               jobs,
               success:true
          })
      } catch (error) {
            console.log(error);
      }
}

// student only
export const getJobById = async(req,res)=>{
      try {
            const jobId = req.params.id;
            const job = await Job.findById(jobId).populate({
               path:"applications"
            });

            if(!job){
                  return res.status(404).json({
                        message:"Job not found.",
                        success:false
                  })
            }
            return res.status(200).json({
                  job,
                  success:true
            })
      } catch (error) {
            console.log(error);
      }
}

// total job created by admin
export const getAdminJobs = async(req,res)=>{
      try {
            const adminId = req.id;
            const jobs = await Job.find({created_by:adminId}).populate({
               path:'company',
               createdAt:-1
            });

            if(!jobs){
                  return res.status(404).json({
                        message:"Job not found.",
                        success:false
                  })
            }
            return res.status(200).json({
                  jobs,
                  success:true
            })
            
      } catch (error) {
            console.log(error);
      }
}