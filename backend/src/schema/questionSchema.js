import mongoose from "mongoose";

const revisionSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    completed: { type: Boolean, default: false },
  },
  { _id: true, timestamps: true }
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

    description: {
      type: String
    },

    choices: {
      options: {type: [String], default: []},
      multipleCorrect: {type: Boolean, default: false},
    },

    link: {
      type: String
    },

    favourite: {
      type: Boolean,
      default: false
    },
    
    revisionFormula: {
      type: Object
    }

  },
  {
    timestamps: true,
  }
);

// questionSchema.methods.generateRevision = function () {

//   if (!this.revisionFormula) return []

//   const {k,c,i} = this.revisionFormula
//   const baseDate = this.createdAt || new Date()


//   for (let index = 0; index< i; index++) {
//     const day = Math.round(k* (c**index))
//     const newDate = new Date(baseDate)

//     newDate.setDate(newDate.getDate() + day);
//     newDate.setUTCHours(0, 0, 0, 0);

//     this.revisions.push({date: newDate})
//   }

//   return this.revisions
// }

questionSchema.methods.deleteRevision = async function (revisionId) {
  this.revisions = this.revisions.filter(rev => rev._id.toString() !== revisionId.toString());
  await this.save();
  return this;
};

// questionSchema.virtual('completedCount').get(function () {
//   return this.revisions.filter(r => r && r.completed).length;
// });

// questionSchema.virtual('lastRevised').get(function() {
//   for (let i = this.revisions.length - 1; i >= 0; i--) {
//     const revision = this.revisions[i];
//     if (revision && revision.completed) {
//       return revision.date;
//     }
//   }
//   return null;
// });


// questionSchema.virtual("upcomingRevisions").get(function () {
//   const today = new Date();
//   today.setUTCHours(0, 0, 0, 0);

//   const n = this.revisions.length;
//   let lastCompletedIndex = -1;

//   for (let i = n - 1; i >= 0; i--) {
//     if (this.revisions[i] && this.revisions[i].completed) {
//       lastCompletedIndex = i;
//       break;
//     }
//   }

//   questionSchema.virtual("lastRevisions").get(function () {
//   const completed = this.revisions
//     .filter(r => r && r.completed)      
//     .sort((a, b) => b.date - a.date);  

//   return completed.slice(0, 3);         
// });


//   const startIndex = lastCompletedIndex === -1 ? 0 : lastCompletedIndex + 1;

//   return this.revisions
//     .slice(startIndex, startIndex + 3)
//     .filter(rev => rev && rev.date >= today && !rev.completed);
// });


questionSchema.set("toJSON", { virtuals: true });
questionSchema.set("toObject", { virtuals: true });


export const Question = mongoose.model("Question", questionSchema);
