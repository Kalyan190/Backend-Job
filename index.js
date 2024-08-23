// import express from "express";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import dotenv from "dotenv"
// import connectDb from "./utils/database.js";
// import userRoute from '../backend/routes/user.routes.js'
// import companyRoute from '../backend/routes/company.route.js'
// import jobRoute from '../backend/routes/job.routes.js'
// import applicationRoute from '../backend/routes/application.route.js'

// dotenv.config({})


// const app = express();

// //use middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser())

// // const corsOptions = {
// //    origin: 'https://job-portal-epbf.vercel.app',
// //    credentials: true
// // }

// const corsOptions = {
//    origin: 'https://job-portal-epbf.vercel.app', // Allow only requests from this origin
//    methods: 'GET,POST,PUT,OPTIONS,DELETE,UPDATE,PATCH', // Allow only these methods
//    // allowedHeaders: ['Content-Type', 'Authorization'] // Allow only these headers
// };

// // Use CORS middleware with specified options
// app.use(cors(corsOptions));

// app.use(cors(corsOptions))

// const PORT = process.env.PORT || 3000;

// app.use("/api/v1/users/", userRoute)
// app.use("/api/v1/company/", companyRoute);
// app.use("/api/v1/job/", jobRoute);
// app.use("/api/v1/application/", applicationRoute);
// app.use("/api/home",(req,res)=>{
//       res.json("Hello World")
   
// })



// app.listen(PORT, () => {
//    connectDb();
//    console.log(`Server running at port ${PORT}`);
//    console.log(process.env.BASE_URL);
// })


import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./utils/database.js";
import userRoute from '../backend/routes/user.routes.js';
import companyRoute from '../backend/routes/company.route.js';
import jobRoute from '../backend/routes/job.routes.js';
import applicationRoute from '../backend/routes/application.route.js';

dotenv.config();

const app = express();

// Use middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
   origin: 'https://job-portal-epbf.vercel.app', // Allow only requests from this origin
   methods: 'GET,POST,PUT,OPTIONS,DELETE,UPDATE,PATCH', // Allow only these methods
   credentials: true, // Allow credentials (cookies, authorization headers)
   allowedHeaders: ['Content-Type', 'Authorization'], // Allow only these headers
};

app.use(cors(corsOptions)); // Use CORS middleware with specified options

const PORT = process.env.PORT || 3000;

app.use("/api/v1/users/", userRoute);
app.use("/api/v1/company/", companyRoute);
app.use("/api/v1/job/", jobRoute);
app.use("/api/v1/application/", applicationRoute);
app.use("/api/home", (req, res) => {
   res.json("Hello World");
});

app.listen(PORT, () => {
   connectDb();
   console.log(`Server running at port ${PORT}`);
   console.log(process.env.BASE_URL);
});



