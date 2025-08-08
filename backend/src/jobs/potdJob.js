import cron from "node-cron";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../schema/userSchema.js";
import { Question } from "../schema/questionSchema.js";

export const potdAndStreakJob = () => {
  cron.schedule(
    "0 0 * * *",
    asyncHandler(async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await User.updateMany(
        {
          $or: [
            { lastPOTDDate: { $exists: false } },
            {
              lastPOTDDate: {
                $lt: new Date(today.getTime() - 86400000), 
              },
            },
          ],
        },
        { $set: { streakCount: 0 } }
      );

      const users = await User.find();

      for (const user of users) {
        const [randomQuestion] = await Question.aggregate([
          { $match: { userId: user._id /*, optionally revisions completed filter */ } },
          { $sample: { size: 1 } },
        ]);

        if (randomQuestion) {
          await User.updateOne(
            { _id: user._id },
            {
              $set: {
                "currentPOTD.questionId": randomQuestion._id,
                "currentPOTD.assignedAt": new Date(),
                "currentPOTD.completed": false,
              },
            }
          );
        }
      }
    })
  );
};
