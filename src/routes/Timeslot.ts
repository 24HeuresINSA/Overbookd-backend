import { Request, Response } from "express";
import TimeslotModel, { ITimeslot } from "@entities/Timeslot";
import StatusCodes from "http-status-codes";
import logger from "@shared/Logger";

export async function getAvailabilities(req: Request, res: Response) {
  const availabilities = await TimeslotModel.find({});
  res.json(availabilities);
}

export async function updateAvailabilities(req: Request, res: Response) {
  const mAvailabilities = <ITimeslot>req.body;
  if (mAvailabilities._id === undefined) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Availabilities must contain an ID" });
  }
  // @ts-ignore
  await AvailabilitiesModel.findByIdAndUpdate(
    mAvailabilities._id,
    // @ts-ignore
    mAvailabilities
  );
  res.sendStatus(StatusCodes.OK);
}

export async function setAvailabilities(req: Request, res: Response) {
  const mTimeslot = <ITimeslot>req.body;
  // creating Equipment
  logger.info(`creating Availabilities ${mTimeslot.groupTitle}`);
  await TimeslotModel.create(mTimeslot);
  res.sendStatus(StatusCodes.CREATED);
}
