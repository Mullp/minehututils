import User, { IUser } from "../models/user.model";
import Server, { IServer } from "../models/server.model";

interface IUpdateUserInput {
  servers?: Array<IServer["id"]>;
}

const UpdateUser = async (id: IUser["id"], { servers }: IUpdateUserInput) => {
  return await User.findOneAndUpdate(
    { id },
    { servers },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )
    .then((data) => {
      return data;
    })
    .catch((error: Error) => {
      throw error;
    });
};

interface IPushUserServerInput {
  servers?: Array<IServer["id"]>;
}

const PushUserServer = async (
  id: IUser["id"],
  { servers }: IPushUserServerInput
) => {
  return await User.findOneAndUpdate(
    { id },
    { $addToSet: { servers } },
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
  UpdateUser,
  PushUserServer,
};
