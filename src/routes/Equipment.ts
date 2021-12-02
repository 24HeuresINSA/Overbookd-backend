import {Request, Response} from "express";
import EquipmentModel, {IEquipment} from "@entities/Equipment";
import StatusCodes from "http-status-codes";
import logger from "@shared/Logger";

export async function getEquipment(req: Request, res: Response) {
  const equipment = await EquipmentModel.find({});
  res.json(equipment);
}

export async function setEquipment(req: Request, res: Response) {
  const mEquipment = <IEquipment>req.body;
  if (await EquipmentModel.exists({ _id: mEquipment._id })) {
    // this Equipment already exists so update it
    logger.info(`updating equipment ${mEquipment._id}`);
    await EquipmentModel.replaceOne({_id: mEquipment._id}, mEquipment);
    res.status(StatusCodes.OK).json(mEquipment);
  } else {
    // creating Equipment
    logger.info(`creating equipment ${mEquipment.name}`);
    const neweq = await EquipmentModel.create(mEquipment);
    res.status(StatusCodes.CREATED).json(neweq);
  }
}
