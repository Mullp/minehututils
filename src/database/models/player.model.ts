import mongoose, { Schema, Document, ObjectId } from "mongoose";

export enum Rank {
  default = "default",
  vip = "vip",
  pro = "pro",
  legend = "legend",
  patron = "patron",
  helper = "helper",
  moderator = "moderator",
  seniorModerator = "senior moderator",
  administrator = "administrator",
  youtube = "youtube",
  artist = "artist",
  tester = "tester",
}

export interface IPlayer extends Document {
  uuid: string;
  rank?: Rank;
}

const PlayerSchema: Schema = new Schema(
  {
    uuid: { type: String, required: true, unique: true },
    rank: { type: String, enum: Object.values(Rank) },
  },
  { timestamps: true }
);

export default mongoose.model<IPlayer>("Player", PlayerSchema);
