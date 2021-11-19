import StatusCodes from "http-status-codes";
import { RequestHandler } from "express";
import logger from "@shared/Logger";
import UserModel, { IUser, SafeUser } from "@entities/User";
import path from "path";
import * as fs from "fs";
import { Types } from "mongoose";

export const getUsers: RequestHandler = async function (req, res) {
  const users = await UserModel.find({});
  const safeUsers = users.map((user) => new SafeUser(user));
  return res.json(safeUsers);
};

export const getUser: RequestHandler = async function (req, res) {
  return res.json(new SafeUser(res.locals.auth_user));
};

export const getUserByID: RequestHandler = async function (req, res) {
  const _id = req.params.userID;
  const user = await UserModel.findOne({ _id });
  if(user){
    res.json(new SafeUser(user));
  } else {
    res.status(StatusCodes.NOT_FOUND).json({
      error: "User not found"
    });
  }
};

export const updateUserByID: RequestHandler = async function (req, res) {
  const user = await UserModel.findOneAndUpdate(
    { _id: req.params.userID },
    req.body
  );
  if(user){
    res.json(new SafeUser(user));
  } else {
    res.status(StatusCodes.NOT_FOUND).json({
      error: "User not found"
    });
  }
};

function capitalizeFirstLetter(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export const getAllUsersName: RequestHandler = async function (req, res) {
  const users = await UserModel.find({});
  res.json(
    users.map((user) => {
      return {
        _id: user._id,
        username: `${capitalizeFirstLetter(
          user.firstname
        )} ${user.lastname.toUpperCase()}`,
      };
    })
  );
};

export const addAvailabilities: RequestHandler = async function (req, res){
  const id = res.locals.auth_user._id;
  const timeslotIds: Types.ObjectId[] = req.body;
  try{
    const user = await UserModel.findById(id);
    if(user){
      if(user.availabilities){
        const toAdd = timeslotIds.filter((e) => {
          return !(user.availabilities!.includes(e))
        })
        user.availabilities.push(...toAdd);
      } else {
        user.availabilities = timeslotIds;
      }
      user.save()
      res.status(StatusCodes.OK).json(new SafeUser(user));
    }else{
      res.sendStatus(StatusCodes.NOT_FOUND).json({
        'msg': 'User not found'
      });
    }
  }catch(e){
    logger.err(e);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR).json({
      'msg': 'Error, contact your admin'
    });
  }
}

export const addNotificationByFullName: RequestHandler = async function (
  req,
  res
) {
  const query = req.params;
  if (!query.firstname || !query.lastname) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide firstname and lastname" });
  } else {
    const user = await UserModel.findOne({
      firstname: query.firstname,
      lastname: query.lastname,
    });
    if (user) {
      const mUser = user.toObject();
      if (mUser.notifications === undefined) {
        mUser.notifications = [];
      }
      mUser.notifications.push(req.body);

      await UserModel.findByIdAndUpdate(user._id, {
        notifications: mUser.notifications,
      });
      res.sendStatus(StatusCodes.OK);
    } else {
      res
        .sendStatus(StatusCodes.NOT_FOUND)
        .json({ msg: "Did not find the user" });
    }
  }
};

export const broadcastNotification: RequestHandler = async function (req, res) {
  const users = await UserModel.find({});
  await Promise.all(
    users.map(async (user) => {
      const mUser = user.toObject();
      if (mUser.notifications === undefined) {
        mUser.notifications = [];
      }
      mUser.notifications.push(req.body);
      await UserModel.findByIdAndUpdate(mUser._id, {
        notifications: mUser.notifications,
      });
    })
  );
  res.sendStatus(StatusCodes.OK);
};

export const uploadPP: RequestHandler = async function (req, res) {
  const user = await UserModel.findById(req.body.userID);
  if (user) {
    const oldUser = user.toObject();
    if (oldUser.pp) {
      const filename = oldUser.pp;
      const dirname = path.resolve();
      if (fs.existsSync(`${dirname}/images/${filename}`)) {
        fs.unlinkSync(`${dirname}/images/${filename}`);
        logger.info(`deleted ${filename} 🗑`);
      }
    }
    await UserModel.findByIdAndUpdate(req.body.userID, {
      // @ts-ignore
      pp: req.files[0].filename,
    });
    logger.info("pp updated");

    res.json("/image api");
  }
};

export const getPP: RequestHandler = async function (req, res) {
  const filename = req.params.filename;
  const dirname = path.resolve();
  logger.info("getting image " + filename);
  return res.sendFile(`${dirname}/images/${filename}`);
};

interface friendRequest {
  from: string;
  to: {
    id: string;
    username: string;
  };
}

//todo
export const createFriendship: RequestHandler = async function (req, res) {
  // check if
  const friends = <friendRequest>req.body;

  logger.info("creating friendships ❤️ " + friends + " ...");

  const [fromUser, toUser] = await Promise.all([
    UserModel.findById(friends.from),
    UserModel.findById(friends.to.id),
  ]);

  if (fromUser && toUser) {
    const MFromUser = <IUser>fromUser.toObject();
    const MToUser = <IUser>toUser.toObject();

    let mFriends: { id: string; username: string }[] = [];
    const notifications = MFromUser.notifications;
    notifications?.shift();
    if (MFromUser.friends) {
      // @ts-ignore
      mFriends = MFromUser.friends;
    }
    mFriends.push(friends.to);
    // @ts-ignore
    await UserModel.findByIdAndUpdate(friends.from, {
      friends: mFriends,
      notifications,
    });

    mFriends = [];
    if (MToUser.friends) {
      // @ts-ignore
      mFriends = MToUser.friends;
    }
    mFriends.push({
      username: `${capitalizeFirstLetter(
        MFromUser.firstname
      )} ${MFromUser.lastname.toUpperCase()}`,
      // @ts-ignore
      id: MFromUser._id,
    });

    // @ts-ignore
    await UserModel.findByIdAndUpdate(friends.to.id, {
      friends: mFriends,
    });
  }

  return res.sendStatus(200);
};
