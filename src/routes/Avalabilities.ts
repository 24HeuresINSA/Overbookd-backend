/*import { Request, Response } from "express";
import AvailabilitiesModel, { IAvailabilities } from "@entities/Timeslot";
import StatusCodes from "http-status-codes";
import logger from "@shared/Logger";

export async function getAvailabilities(req: Request, res: Response) {
  const availabilities = await AvailabilitiesModel.find({});
  res.json(availabilities);
}

export async function updateAvailabilities(req: Request, res: Response) {
  const mAvailabilities = <IAvailabilities>req.body;
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
  const mAvailabilities = <IAvailabilities>req.body;
  // creating Equipment
  logger.info(`creating Availabilities ${mAvailabilities.name}`);
  await AvailabilitiesModel.create(mAvailabilities);
  res.sendStatus(StatusCodes.CREATED);
}*/
