import { config } from "dotenv"
import express from "express"
import morgan from "morgan"
import db_connection from "./src/config/DB_connection.js"
import { authRouter } from "./src/routes/auth.routes.js"
import { priceComparisonRouter } from "./src/routes/price-comparison.routes.js"
import { globalResponse } from "./src/middlewares/general-responce.middleware.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import { urlPhishingRouter } from "./src/routes/url-phishing.routes.js"

config()
//start express app
const app=express()

app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from your frontend
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    methods: ['GET', 'POST', 'OPTIONS','PUT'], // Allow these methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
}));

app.use(morgan('dev'))

app.use(cookieParser());
//parsing incoming JSON payloads and making that data available in the req.body
app.use(express.json());

app.use("/api/auth",authRouter)
app.use("/api/price-comparison",priceComparisonRouter)
app.use("/api/url-phishing",urlPhishingRouter)

app.use(globalResponse)
//connection with database
db_connection()

//get port that server will run on it from env file (environment variable)
const port = +process.env.PORT || 5000

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})

export default app