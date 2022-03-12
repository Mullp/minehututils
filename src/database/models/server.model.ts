import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user.model";

export interface IServer extends Document {
  id: string;
  owner: IUser["_id"];
}

const ServerSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    owner: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IServer>("Server", ServerSchema);
