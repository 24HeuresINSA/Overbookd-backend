import {Request, Response} from "express";
import EquipmentModel, {IEquipment} from "@entities/Equipment";
import EquipmentProposalModel, { IEquipmentProposal } from "@entities/EquipmentProposal";
import StatusCodes from "http-status-codes";
import logger from "@shared/Logger";

export async function getEquipment(req: Request, res: Response) {
  const equipment = await EquipmentModel.find({});
  res.json(equipment);
}

export async function createEquipment(req: Request, res: Response) {
  const equipment: IEquipment = req.body;
  try {
    const newEquipment = await EquipmentModel.create(equipment);
    res.status(StatusCodes.CREATED).json(newEquipment);
  } catch (e) {
    logger.err(e);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
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

export async function createEquipmentProposal(req: Request, res: Response) {
  const equipmentProposal: IEquipmentProposal = req.body;
  try {
    const newEquipmentProposal = await EquipmentProposalModel.create(equipmentProposal);
    res.status(StatusCodes.CREATED).json(newEquipmentProposal);
  } catch (e) {
    logger.err(e);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
}

export async function deleteEquipmentProposal(req: Request, res: Response) {
  const equipmentProposal: IEquipmentProposal = req.body;
  try {
    const newEquipmentProposal = await EquipmentProposalModel.deleteOne(equipmentProposal);
    res.status(StatusCodes.CREATED).json(newEquipmentProposal);
  } catch (e) {
    logger.err(e);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
}

export async function getEquipmentProposals(req: Request, res: Response) {
  const equipmentProposals = await EquipmentProposalModel.find({});
  res.json(equipmentProposals);
}