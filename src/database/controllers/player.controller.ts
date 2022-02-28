import Player, { IPlayer } from "../models/player.model";

interface ICreatePlayerInput {
  uuid: IPlayer["uuid"];
  rank?: IPlayer["rank"];
}

interface IUpdatePlayerInput {
  uuid: IPlayer["uuid"];
  rank?: IPlayer["rank"];
}

interface IDeletePlayerInput {
  uuid: IPlayer["uuid"];
}

const CreatePlayer = async ({ uuid, rank }: ICreatePlayerInput) => {
  return await Player.create({ uuid, rank })
    .then((data) => {
      return data;
    })
    .catch((error: Error) => {
      throw error;
    });
};

const UpdatePlayer = async ({ uuid, rank }: IUpdatePlayerInput) => {
  return await Player.findOneAndUpdate(
    { uuid },
    { uuid, rank },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )
    .then((data) => {
      return data;
    })
    .catch((error: Error) => {
      throw error;
    });
};

const DeletePlayer = async ({ uuid }: IDeletePlayerInput) => {
  return await Player.findOneAndDelete({ uuid })
    .then((data) => {
      return data;
    })
    .catch((error: Error) => {
      throw error;
    });
};

const AllPlayers = async () => {
  return await Player.find()
    .then((data) => {
      return data;
    })
    .catch((error: Error) => {
      throw error;
    });
};

export default {
  CreatePlayer,
  UpdatePlayer,
  DeletePlayer,
  AllPlayers,
};
