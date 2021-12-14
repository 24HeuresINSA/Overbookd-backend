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
  addAvailabilities,
} from "./Users";
import {createFA, deleteFA, getFAByCount, getFAs, setFA} from "./FA";
import * as EquipmentHandler from "./Equipment";
import * as TimeslotHandler from './Timeslot'
import {createFT, deleteFT, getAllFTs, getFTByID, unassign, updateFT,} from "./FT";
import * as TransactionHandlers from "./transactions";
import * as AuthHandlers from "./Auth";
import issueHandler from "./Issue";
import * as authMiddleware from "@src/middleware/auth";
import * as AssignmentHandlers from "./Assignment";
import * as LocationHandlers from "./Location";

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
userRouter.post("/availabilities", authMiddleware.protect(), addAvailabilities);
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
equipmentRouter.get("/", authMiddleware.protect(), EquipmentHandler.getEquipment);
equipmentRouter.put("/", authMiddleware.protect(), EquipmentHandler.setEquipment);
equipmentRouter.post("/", authMiddleware.protect(), EquipmentHandler.createEquipment);

const equipmentProposalRouter = Router();
equipmentProposalRouter.get("/", authMiddleware.protect(), EquipmentHandler.getEquipmentProposals);
equipmentProposalRouter.post("/", authMiddleware.protect(), EquipmentHandler.createEquipmentProposal);
equipmentProposalRouter.delete("/:id", authMiddleware.protect(), EquipmentHandler.deleteEquipmentProposal);
equipmentProposalRouter.put("/:id/validate", authMiddleware.protect(), EquipmentHandler.validateEquipmentProposal);

// Availabilities routes
const timeslotRouter = Router();
timeslotRouter.get("/", authMiddleware.protect(), TimeslotHandler.getTimeslot);
timeslotRouter.post(
  "/",
  authMiddleware.protect(),
  TimeslotHandler.createTimeslot
);
timeslotRouter.put(
  "/",
  authMiddleware.protect(),
  TimeslotHandler.updateTimeslot
);
timeslotRouter.get(
  "/:id",
  authMiddleware.protect(),
  TimeslotHandler.getTimeslotById
);
timeslotRouter.post(
  "/many",
  authMiddleware.protect(),
  TimeslotHandler.createManyTimeslots
);
timeslotRouter.put(
  "/:id/:charisma",
  authMiddleware.protect(),
  TimeslotHandler.updateTimeslotCharisma
);
timeslotRouter.delete(
  "/:id",
  authMiddleware.protect(),
  TimeslotHandler.deleteTimeslot
);
// Transactions routes

const assignmentRouter = Router();
assignmentRouter.get(
  "/",
  authMiddleware.protect(),
  AssignmentHandlers.getAssignments
);
assignmentRouter.post(
  "/",
  authMiddleware.protect(),
  AssignmentHandlers.createAssignment
);
assignmentRouter.put(
  "/",
  authMiddleware.protect(),
  AssignmentHandlers.updateAssignment
);
assignmentRouter.get(
  "/user/:id",
  authMiddleware.protect(),
  AssignmentHandlers.getAssignmentsByUserId
);
assignmentRouter.get(
  "/ft/:id",
  authMiddleware.protect(),
  AssignmentHandlers.getAssignmentsByFTId
);

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

const locationRouter = Router();
locationRouter.get("/", authMiddleware.protect(), LocationHandlers.getLocations);
locationRouter.post("/", authMiddleware.protect(), LocationHandlers.createLocation);
locationRouter.put("/", authMiddleware.protect(), LocationHandlers.setLocation);
locationRouter.delete("/:id", authMiddleware.protect(), LocationHandlers.deleteLocation);
locationRouter.get("/:id", authMiddleware.protect(), LocationHandlers.getLocationById);
locationRouter.post("/many", authMiddleware.protect(), LocationHandlers.createManyLocations);

// Export the base-router
const baseRouter = Router();
baseRouter.use("/user", userRouter);
baseRouter.use("/config", configRouter);
baseRouter.use("/FA", FArouter);
baseRouter.use("/FT", FTrouter);
baseRouter.use('/equipment/proposal', equipmentProposalRouter);
baseRouter.use("/equipment", equipmentRouter);
baseRouter.use("/timeslot", timeslotRouter);
baseRouter.use("/transaction", transactionRouter);
baseRouter.use("/assignment", assignmentRouter);
baseRouter.use("/location", locationRouter);

baseRouter.post("/issue", issueHandler);

//auth
baseRouter.post("/signup", AuthHandlers.signup);
baseRouter.post("/login", AuthHandlers.login);
baseRouter.post("/migrate", AuthHandlers.migrate);
baseRouter.post("/forgot", AuthHandlers.forgot);
baseRouter.post("/reset", AuthHandlers.recoverPassword);

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
