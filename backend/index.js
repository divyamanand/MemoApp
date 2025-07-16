import { connectDB } from "./db.js";
import { app } from "./app.js";



connectDB(process.env.DB_URL)
.then(() => {
    app.on("error", (error) => {
        console.log("ERROR: ", error)
        throw error
    })
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at PORT ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log("MONGO db connection failed!!", err)
})

