import mongoose, { Schema, Document } from "mongoose";

export interface IFeedback extends Document {
  by: string;
  subject: string;
  feedback: string;
  contact: string;
}

const FeedbackSchema: Schema = new Schema(
  {
    by: { type: String, required: true },
    subject: { type: String, required: true },
    feedback: { type: String, required: true },
    contact: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IFeedback>("Feedback", FeedbackSchema);
