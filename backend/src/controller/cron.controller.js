import { User } from "../schema/userSchema";
import { asyncHandler } from "../utils/AsyncHandler";
import cron from "node-cron"



    cron.schedule('0 0 * * *', asyncHandler(async (req, res) => {
    const users = await User.find()
    const today = new Date()

    for (const user of users) {
        
        const lastSolved = user.lastPOTDDate
        const isBeforeYesterday = today.setHours(0,0,0,0)  - lastSolved.setHours(0,0,0,0) > 86400000

        if (isBeforeYesterday || !lastSolved) {
            user.streakCount = 0
            await user.save()
        }

        //generatePOTD logic will be written later
    }
}))