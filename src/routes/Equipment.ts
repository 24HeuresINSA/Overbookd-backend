import {Request, Response} from "express";
import EquipmentModel from "@entities/Equipment";
import StatusCodes from "http-status-codes";
import logger from "@shared/Logger";


export async function getEquipment(req: Request, res: Response) {
    const equipment = await EquipmentModel.find({});
    res.json(equipment);
}

export async function setEquipment(req: Request, res: Response) {
    const mEquipment = req.body;
    if(mEquipment.name === undefined){
        res.status(StatusCodes.BAD_REQUEST).json({error: "equipment must contain a name"})
    }
    if (await EquipmentModel.exists({name: mEquipment.name})){
        // this Equipment already exists so update it
        logger.info(`updating equipment ${mEquipment.name}`)
        await EquipmentModel.replaceOne({name: mEquipment.name}, mEquipment)
        res.sendStatus(StatusCodes.OK)
    } else {
        // creating Equipment
        logger.info(`creating equipment ${mEquipment.name}`)
        await EquipmentModel.create(mEquipment);
        res.sendStatus(StatusCodes.CREATED)
    }
}



