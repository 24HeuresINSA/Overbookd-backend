import {Request, Response} from "express";
import AvailabilitiesModel from "@entities/avalibilities";
import StatusCodes from "http-status-codes";
import logger from "@shared/Logger";


export async function getAvailabilities(req: Request, res: Response) {
    const availabilities = await AvailabilitiesModel.find({});
    res.json(availabilities);
}

export async function updateAvailabilities(req: Request, res: Response) {
    const mAvailabilities = req.body;
    if(mAvailabilities.name === undefined){
        res.status(StatusCodes.BAD_REQUEST).json({error: "Availabilities must contain a name"})
    }
    if (await AvailabilitiesModel.exists({name: mAvailabilities.name})){
        // this Equipment already exists so update it
        logger.info(`updating Availabilities ${mAvailabilities.name}`)
        await AvailabilitiesModel.replaceOne({name: mAvailabilities.name}, mAvailabilities)
        res.sendStatus(StatusCodes.OK)
    } else {
        // creating Equipment
        logger.info(`creating Availabilities ${mAvailabilities.name}`)
        await AvailabilitiesModel.create(mAvailabilities);
        res.sendStatus(StatusCodes.CREATED)
    }
}

export async function setAvailabilities(req: Request, res: Response) {
    const mAvailabilities = req.body;
    // creating Equipment
    logger.info(`creating Availabilities ${mAvailabilities.name}`)
    await AvailabilitiesModel.create(mAvailabilities);
    res.sendStatus(StatusCodes.CREATED)
}



