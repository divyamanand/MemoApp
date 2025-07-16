import mongoose from "mongoose";

const revisionSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true },
  {timestamps: true}
);

const questionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    questionName: {
      type: String,
      required: [true, "Question name is required"],
      trim: true,
    },

    difficulty: {
      type: String,
      required: [true, "Please mention difficulty"],
      trim: true
    },

    tags: {
      type: [String],
      default: [],
    },

    revisions: {
      type: [revisionSchema],
      default: [],
    },

    formData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

  },
  {
    timestamps: true,
  }
);

questionSchema.methods.generateRevision = function () {

  if (!this.formData?.revisionFormula) return []

  const {k,c,i} = this.formData.revisionFormula
  const baseDate = this.createdAt || new Date()

  // console.log(baseDate, "Base Date")

  for (let index = 0; index< i; index++) {
    const day = Math.round(k* (c**index))
    const newDate = new Date(baseDate)

    newDate.setDate(newDate.getDate() + day);
    newDate.setUTCHours(0, 0, 0, 0);

    // console.log(newDate, "new Date")
    this.revisions.push({date: newDate})
  }

  return this.revisions
}

questionSchema.methods.deleteRevision = async function (revisionId) {
  this.revisions = this.revisions.filter(rev => rev._id !== revisionId)
  await this.save()
  return this
}

questionSchema.virtual('completedCount').get(function () {
  return this.revisions.filter(r => r.completed).length;
});

questionSchema.set("toJSON", { virtuals: true });
questionSchema.set("toObject", { virtuals: true });


export const Question = mongoose.model("Question", questionSchema);
