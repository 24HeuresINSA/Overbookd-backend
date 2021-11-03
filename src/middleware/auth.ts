import UserModel from "@entities/User";
import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

export const protect: () => RequestHandler = () => {
  const f: RequestHandler = async function (req, res, next) {
    const authorization = req.header("Authorization");

    if (!authorization) {
      return res.status(400).json({
        msg: "Authorization header missing or invalid",
      });
    }

    const authorizationSplited = authorization.split(" ");
    if (
      authorizationSplited[0] != "Bearer" ||
      authorizationSplited.length != 2
    ) {
      return res.status(400).json({
        msg: "Malformed bearer token",
      });
    }

    const token = authorizationSplited[1];

    try {
      const decoded = jwt.verify(token, "randomString");
      if (typeof decoded == "string" || !("userID" in decoded)) {
        return res.status(400).json({
          msg: "Invalid token content",
        });
      }
      const user = await UserModel.findOne({ _id: decoded.userID });
      if (!user) {
        return res.status(400).json({
          msg: "Could not retrieve token's user in database",
        });
      }
      res.locals["auth_user"] = user;

      // Verify user has at least 1 role
      if (!user.team || user.team.length == 0) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          msg: "User must have at least one team assigned",
        });
      }

      next();
    } catch (error) {
      res.status(500).send({ message: "Invalid Token" });
    }
  };

  return f;
};

export const verifyRoles: (roles: Array<string>) => RequestHandler = function (
  roles: Array<string>
) {
  const f: RequestHandler = (req, res, next) => {
    const user = res.locals.auth_user;
    if (!user) {
      return res.status(500).json({
        msg: "Could not retrieve user to verify roles",
      });
    }

    roles.forEach((role) => {
      if (!(role in user.team)) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          msg: "User does not have required roles to access the resource.",
        });
      }
    });

    next();
  };

  return f;
};
