import jwt from "jsonwebtoken"

const isAuthenticated = async (req,res,next)=>{
      try {
         const bearer = req.headers.authorization;
         const token = bearer.split(' ')[1];
            if(!token){
                  return res.status(401).json({
                        message:"User not authenticated.",
                        success:false
                  })
            }
            const decode = await jwt.verify(token,process.env.SECRET_KEY);
          
            if(!decode){
                  return res.status(401).json({
                        message:"Invalid token.",
                        success:false
                  })
            }
           req.id = decode.userID;
           
           next();

      } catch (error) {
            console.log(error)
      }
}

export default isAuthenticated;

