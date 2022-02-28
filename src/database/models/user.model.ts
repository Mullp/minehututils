import mongoose, { Schema, Document, ObjectId } from "mongoose";
import Server, { IServer } from "./server.model";

export interface IUser extends Document {
  id: string;
  servers?: Array<IServer["id"]>;
}

const UserSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    servers: { type: Array<IServer["id"]>() },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
