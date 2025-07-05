import express from "express";
import cors from "cors";
import CookieParser from "cookie-parser"


const app = express();
app.use(cors(
    {
        origin: "http://localhost:5173",
       
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


export default app;
