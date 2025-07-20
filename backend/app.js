import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app  = express()

// app.use(cors({
//     origin: ["http://localhost:8001", "http://localhost:5173"],
//     credentials: true
// }))

app.use(cors())

app.use(express.json({
    limit: "16kb"
}))

app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//routes

import userRouter from "./src/routes/user.routes.js"
import questionRouter from "./src/routes/question.routes.js"

//routes decalaration
app.use("/api/v1/user", userRouter)
app.use("/api/v1/question", questionRouter)

export {app}