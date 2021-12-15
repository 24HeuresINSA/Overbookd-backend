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
  const { id } = req.params;
  const equipmentProposal = await EquipmentProposalModel.findById(id);
  if(!equipmentProposal) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: `Equipment proposal ${id} not found`,
    });
  }
  try {
    await EquipmentProposalModel.deleteOne({_id: equipmentProposal._id });
    res.sendStatus(StatusCodes.OK)
  } catch (e) {
    logger.err(e);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
}

export async function getEquipmentProposals(req: Request, res: Response) {
  const equipmentProposals = await EquipmentProposalModel.find({});
  res.json(equipmentProposals);
}


// when someone from log (or admin) approve a change, create or update the equipment while deleting the proposal
export async function validateEquipmentProposal(req: Request, res: Response) {
  const { id } = req.params;
  const equipmentProposal = await EquipmentProposalModel.findById(id);
  logger.info(`validating equipment proposal ${id}`);
 
  if (!equipmentProposal) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "Equipment proposal not found" });
  }
  try {
    logger.info(`${equipmentProposal.name}, ${equipmentProposal.isNewEquipment} is valid`);
    if(equipmentProposal.isNewEquipment){
      const newEq  = proposalToEquipment(equipmentProposal);
      logger.info(newEq.name + " " + equipmentProposal.name)
      const newEquipment = await EquipmentModel.create(newEq);
      res.status(StatusCodes.CREATED).json(newEquipment);
    } else {
      if(!equipmentProposal.oldEquipment){
        logger.err("no old equipment (should not be happening)");
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Equipment proposal is not valid" });
      }
      await EquipmentModel.replaceOne({_id: equipmentProposal.oldEquipment.toString()}, proposalToEquipment(equipmentProposal));
      res.status(StatusCodes.OK).json(proposalToEquipment(equipmentProposal));
    }
    logger.info(`equipment proposal ${equipmentProposal._id} validated, deleting it`);
    await EquipmentProposalModel.deleteOne({_id: equipmentProposal._id});

  } catch (e) {
    logger.err(e);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
}

function proposalToEquipment(equipmentProposal: IEquipmentProposal): IEquipment {
  // probably not the best way to do this
  return {
    _id: equipmentProposal.oldEquipment ? equipmentProposal.oldEquipment.toString() : undefined,
    name: equipmentProposal.name,
    comment: equipmentProposal.comment,
    location: equipmentProposal.location,
    preciseLocation: equipmentProposal.preciseLocation,
    type: equipmentProposal.type,
    referenceInvoice: equipmentProposal.referenceInvoice,
    referencePicture: equipmentProposal.referencePicture,
    fromPool: equipmentProposal.fromPool,
    borrowed: equipmentProposal.borrowed,
    isValid: true,
    amount: equipmentProposal.amount,
  };
}
