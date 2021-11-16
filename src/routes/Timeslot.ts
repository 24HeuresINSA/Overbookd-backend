import { Request, Response } from "express";
import TimeslotModel, { ITimeslot } from "@entities/Timeslot";
import StatusCodes from "http-status-codes";
import logger from "@shared/Logger";

export async function getTimeslot(req: Request, res: Response) {
  const availabilities = await TimeslotModel.find({});
  res.json(availabilities);
}

export async function getTimeslotById(req: Request, res: Response) {
  const { id } = req.params;
  logger.info(id)
  const timeslot = await TimeslotModel.findById(id);
  if (!timeslot) {
    logger.info(`Timeslot with id ${id} not found`);
    res.status(StatusCodes.NOT_FOUND).json({
      message: `Timeslot with id ${id} not found`
    });
  }
  res.json(timeslot);
}

export async function updateTimeslot(req: Request, res: Response) {
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

export async function createManyTimeslots(req: Request, res: Response) {
  const timeslots = req.body;
  if (timeslots.length === 0) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Timeslots must contain at least one timeslot" });
  }
  const newTimeslots = await TimeslotModel.insertMany(timeslots);
  logger.info(newTimeslots);
  res.status(StatusCodes.OK).json(newTimeslots);
} 

export async function createTimeslot(req: Request, res: Response) {
  //Add validation on time
  const mTimeslot = <ITimeslot>req.body;
  // creating Equipment
  logger.info(`creating Timeslot ${mTimeslot.groupTitle}`);
  await TimeslotModel.create(mTimeslot);
  res.sendStatus(StatusCodes.CREATED)
}
