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
  if (await EquipmentModel.exists({ name: mEquipment.name })) {
    // this Equipment already exists so update it
    logger.info(`updating equipment ${mEquipment.name}`);
    await EquipmentModel.replaceOne({name: mEquipment.name}, mEquipment);
    res.status(StatusCodes.OK).json(mEquipment);
  } else {
    // creating Equipment
    logger.info(`creating equipment ${mEquipment.name}`);
    await EquipmentModel.create(mEquipment);
    res.status(StatusCodes.CREATED).json(mEquipment);
  }
}
