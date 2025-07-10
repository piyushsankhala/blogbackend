import express from "express";
import cors from "cors";
import CookieParser from "cookie-parser"
import userroutes from "./routes/user.route.js";
import blogroutes from "./routes/post.route.js";

import otproutes from "./routes/otp.route.js"

const app = express();
app.use(cors(
    {
        origin: " https://blogfrontend1.netlify.app",
       
        credentials: true,
    }
));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(CookieParser());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.send("API is running...");
});
app.use("/api/user",userroutes)
app.use("/api/blog",blogroutes)
app.use("/api/otp",otproutes)



export default app;
