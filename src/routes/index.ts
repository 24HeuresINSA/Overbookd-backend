import {Request, Response, Router} from "express";
import {getConfig, setConfig} from "./Config";
import mCors from "../cors";
import {
  addNotificationByFullName,
  broadcastNotification,
  createFriendship,
  getAllUsersName,
  getPP,
  getUser,
  getUserByID,
  getUsers,
  updateUserByID,
  uploadPP,
} from "./Users";
import {createFA, deleteFA, getFAByCount, getFAs, setFA} from "./FA";
import {getEquipment, setEquipment} from "./Equipment";
import {getAvailabilities, setAvailabilities, updateAvailabilities,} from "./Avalabilities";
import {createFT, deleteFT, getAllFTs, getFTByID, unassign, updateFT,} from "./FT";
import * as TransactionHandlers from "./transactions";
import * as AuthHandlers from "./Auth";
import issueHandler from "./Issue";
import * as authMiddleware from "@src/middleware/auth";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const multer = require("multer");

function ping(req: Request, res: Response) {
  return res.send("pong");
}

// User-route
const userRouter = Router();
userRouter.get("/", authMiddleware.protect(), getUsers);
userRouter.get("/me", authMiddleware.protect(), getUser);
userRouter.get("/all", authMiddleware.protect(), getAllUsersName);
userRouter.get("/:userID", authMiddleware.protect(), getUserByID);
userRouter.put("/:userID", authMiddleware.protect(), updateUserByID);
userRouter.put(
  "/notification/:lastname/:firstname",
  authMiddleware.protect(),
  addNotificationByFullName
);
userRouter.post("/broadcast", authMiddleware.protect(), broadcastNotification);
userRouter.post("/friends", authMiddleware.protect(), createFriendship);

const imageUpload = multer({
  dest: "images",
});

userRouter.post("/pp", imageUpload.array("files"), uploadPP);
userRouter.get("/pp/:filename", getPP);

// Config-route
const configRouter = Router();
configRouter.get("/", getConfig);
configRouter.put("/", authMiddleware.protect(), setConfig);
configRouter.use(mCors);

// FA-routes
const FArouter = Router();
FArouter.get("/", authMiddleware.protect(), getFAs);
FArouter.get("/:id", authMiddleware.protect(), getFAByCount);
FArouter.post("/", authMiddleware.protect(), createFA);
FArouter.put("/", authMiddleware.protect(), setFA);
FArouter.delete("/", authMiddleware.protect(), deleteFA);

// FT-routes
const FTrouter = Router();
FTrouter.get("/", authMiddleware.protect(), getAllFTs);
FTrouter.get("/:FTID", authMiddleware.protect(), getFTByID);
FTrouter.post("/", authMiddleware.protect(), createFT);
FTrouter.put("/", authMiddleware.protect(), updateFT);
FTrouter.put("/unassign", authMiddleware.protect(), unassign);
FTrouter.delete("/", authMiddleware.protect(), deleteFT);

// Equipment-routes
const equipmentRouter = Router();
equipmentRouter.get("/", authMiddleware.protect(), getEquipment);
equipmentRouter.put("/", authMiddleware.protect(), setEquipment);

// Availabilities routes
const availabilitiesRouter = Router();
availabilitiesRouter.get("/", authMiddleware.protect(), getAvailabilities);
availabilitiesRouter.post("/", authMiddleware.protect(), setAvailabilities);
availabilitiesRouter.put("/", authMiddleware.protect(), updateAvailabilities);

// Transactions routes

const transactionRouter = Router();
transactionRouter.get(
  "/",
  authMiddleware.protect(),
  TransactionHandlers.getAllTransactions
);
transactionRouter.get(
  "/sg",
  authMiddleware.protect(),
  TransactionHandlers.getSgTransactions
);
transactionRouter.get(
  "/user",
  authMiddleware.protect(),
  TransactionHandlers.getSelfTransactions
);
transactionRouter.get(
  "/user/:userID",
  authMiddleware.protect(),
  TransactionHandlers.getUserTransactions
);
transactionRouter.post(
  "/sg",
  authMiddleware.protect(),
  TransactionHandlers.addSgTransactions
);
transactionRouter.post(
  "/transfer",
  authMiddleware.protect(),
  TransactionHandlers.addTransfer
);
transactionRouter.delete(
  "/:id",
  authMiddleware.protect(),
  TransactionHandlers.deleteTransaction
);

// Export the base-router
const baseRouter = Router();
baseRouter.use("/user", userRouter);
baseRouter.use("/config", configRouter);
baseRouter.use("/FA", FArouter);
baseRouter.use("/FT", FTrouter);
baseRouter.use("/equipment", equipmentRouter);
baseRouter.use("/availabilities", availabilitiesRouter);
baseRouter.use("/transaction", transactionRouter);

baseRouter.post("/issue", issueHandler);

//auth
baseRouter.post("/signup", AuthHandlers.signup);
baseRouter.post("/login", AuthHandlers.login);
baseRouter.post("/migrate", AuthHandlers.migrate);

baseRouter.get("/test", authMiddleware.protect(), (req, res) => {
  res.status(200).json({ msg: "it wooooorks !" });
});

baseRouter.get(
  "/testRoles",
  authMiddleware.protect(),
  authMiddleware.verifyRoles(["admin"]),
  (req, res) => {
    res.status(200).json({ msg: "it wooooorks !" });
  }
);

// ping
baseRouter.get("/ping", authMiddleware.protect(), ping);

baseRouter.use(mCors);

export default baseRouter;
