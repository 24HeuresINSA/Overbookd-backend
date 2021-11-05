import bcrypt from "bcryptjs";
import {RequestHandler} from "express";
import jwt from "jsonwebtoken";
import UserModel from "@entities/User";
import logger from "@shared/Logger";
import ConfigModel from "@entities/Config";

export const signup: RequestHandler = async function (req, res) {
  // checking if signup is possible beffore all
  try {
    const value = await ConfigModel.findOne({key: 'isSignupOpen'});
    if(!value || !value.value){
      logger.info(`Signup is closed, ${req.ip} tried to signup`);
      return res.status(400).json({
        msg: "Signup closed !!!"
      })
    }
  } catch(e){
    logger.err(e);
    return res.status(500).json({"msg": "Error fetching conf"})
  }

  const userInput = req.body;
  try {
    let user = await UserModel.findOne({ email: userInput.email });
    if (user) {
      return res.status(400).json({
        msg: "User already exists",
      });
    }

    if (userInput.password != userInput.password2) {
      return res.status(400).json({
        msg: "Passwords mismatch",
      });
    }

    // Hashing and salting password
    const salt = await bcrypt.genSalt(10);
    userInput.password = await bcrypt.hash(userInput.password, salt);
    delete userInput.password2; // DO NOT SAVE INTO DB

    user = await UserModel.create(userInput);

    jwt.sign(
      {userID: user._id},
      "randomString",
      {
        expiresIn: 60 * 60 * 24,
      },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          token,
        });
      }
    );
  } catch (error) {
    //todo log errors
    res.status(500).send("Error while saving user");
  }
};

export const login: RequestHandler = async function (req, res) {
  const userInput = req.body;
  try {
    const user = await UserModel.findOne({ email: userInput.username });
    if (!user) {
      return res.status(400).json({
        msg: "User does not exist dude",
      });
    }

    if (!user.password) {
      logger.info(`user not migrated ${user._id}`);
      return res.status(400).json({
        msg: "User not migrated dude",
      });
    }

    const isMatch = await bcrypt.compare(userInput.password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        msg: "Incorrect password !",
      });
    }
    logger.info(`user connected ${userInput.username}`);

    jwt.sign(
      { userID: user._id },
      "randomString",
      {
        expiresIn: 60 * 60 * 24,
      },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          token,
        });
      }
    );
  } catch (error) {
    logger.err(error);
    res.status(500).json({
      msg: "Server error",
    });
  }
};

export const migrate: RequestHandler = async function (req, res) {
  try {
    const user = await UserModel.findOne({ email: req.body.username });
    if (!user) {
      return res
        .status(400)
        .json({
          msg: `The email provided does not match any user. ${req.body.username}`,
        });
    }
    if (user.password !== undefined) {
      return res.status(400).json({msg: "user has already been migrated"})
    }

    // Hashing and salting password
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    jwt.sign(
      {userID: user._id},
      "randomString",
      {
        expiresIn: 60 * 60 * 24,
      },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          token,
        });
      }
    );
    await user.updateOne({ $set: { password: req.body.password } });
    logger.info(`updated user ${user.email}`);
  } catch (error) {
    res.status(500).end();
  }
};
