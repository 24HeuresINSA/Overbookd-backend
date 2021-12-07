import bcrypt from "bcryptjs";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import UserModel from "@entities/User";
import logger from "@shared/Logger";
import ConfigModel from "@entities/Config";
import { StatusCodes } from "http-status-codes";
import { randomBytes } from "crypto";
import { sendResetMail } from "@src/services/mail";

export const signup: RequestHandler = async function (req, res) {
  // checking if signup is possible beffore all
  try {
    const value = await ConfigModel.findOne({ key: "isSignupOpen" });
    if (!value || !value.value) {
      logger.info(`Signup is closed, ${req.ip} tried to signup`);
      return res.status(400).json({
        msg: "Signup closed !!!",
      });
    }
  } catch (e) {
    logger.err(e);
    return res.status(500).json({ msg: "Error fetching conf" });
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
      return res.status(400).json({
        msg: `The email provided does not match any user. ${req.body.username}`,
      });
    }
    if (user.password !== undefined) {
      return res.status(400).json({ msg: "user has already been migrated" });
    }

    // Hashing and salting password
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

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
    await user.updateOne({ $set: { password: req.body.password } });
    logger.info(`updated user ${user.email}`);
  } catch (error) {
    res.status(500).end();
  }
};

// forgot generate a token, store it with the user
export const forgot: RequestHandler = async function (req, res) {
  const email: string = req.body.userEmail;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      // We found a user that match the email
      const resetToken = randomBytes(20).toString("hex");
      // Set expiration date to now +1 hour
      const expirationDate = new Date(Date.now() + 1 * 3600 * 1000);
      user.resetPasswordToken = resetToken;
      user.resetTokenExpires = expirationDate;
      user.save();

      // Even if this does not work we still return the same statusCode
      await sendResetMail(resetToken, user.email)

      res.sendStatus(StatusCodes.OK);
    } else {
      // Return OK to not give info about user not found
      logger.info("Got reset request with wrong email");
      res.sendStatus(StatusCodes.OK);
    }
  } catch (e) {
    logger.err(e);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Error while processing the request",
    });
  }
};

export const recoverPassword: RequestHandler = async function (req, res) {
  // code
  const token = req.body.token;
  const password: string = req.body.password;
  const password2: string = req.body.password2;

  if (!password || !password2 || password != password2) {
    return res.sendStatus(StatusCodes.BAD_REQUEST).json({
      msg: "password and password 2 does not match.",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  try {
    const user = await UserModel.findOne({ resetPasswordToken: token });
    if (user && user.resetTokenExpires) {
      // Check if token is expired
      if (user.resetTokenExpires < new Date(Date.now())) {
        user.resetTokenExpires = undefined;
        user.resetPasswordToken = undefined;
        user.save();

        return res.sendStatus(StatusCodes.FORBIDDEN).json({
          msg: "reset token of this user is expired",
        });
      }

      // store hash of the new password
      user.password = hash;

      user.resetTokenExpires = undefined;
      user.resetPasswordToken = undefined;
      user.save();

      res.sendStatus(StatusCodes.OK).json({
        msg: "Password has been updated.",
      });
    } else {
      res.sendStatus(StatusCodes.NOT_FOUND).json({
        msg: "Token does not match any password reset request",
      });
    }
  } catch (e) {
    logger.err(e);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Error while processing the request",
    });
  }
};
