import Server, { IServer } from "../models/server.model";
import User, { IUser } from "../models/user.model";
import UserController from "./user.controller";

interface IUpdateServerInput {
  owner: IUser["id"];
}

const UpdateServer = async (
  id: IServer["id"],
  { owner }: IUpdateServerInput
) => {
  UserController.PushUserServer(owner, { servers: [id] });

  return await Server.findOneAndUpdate(
    { id },
    { owner },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )
    .then((data) => {
      return data;
    })
    .catch((error: Error) => {
      throw error;
    });
};

export default {
  UpdateServer,
};
