import FAModel from "@entities/FA";
import {Request, Response} from "express";
import logger from "@shared/Logger";
import StatusCodes from 'http-status-codes';


export async function getFAs(req: Request, res: Response) {
    const FAs = await FAModel.find({});
    logger.info("getting all FAs");
    res.json(FAs)
}

export async function getFAByName(req: Request, res: Response) {
    if(req.params.name === undefined){
        res.status(StatusCodes.BAD_REQUEST).json({error: "FA must contain a name"})
    }
    const mFA = await FAModel.findOne({name: req.params.name})
    res.json(mFA);
}

export async function setFA(req: Request, res: Response) {
    const mFA = req.body;
    if(mFA.name === undefined){
        res.status(StatusCodes.BAD_REQUEST).json({error: "FA must contain a name"})
    }
    if (await FAModel.exists({name: mFA.name})){
        // this FA already exists so update it
        logger.info(`updating FA ${mFA.name}`)
        await FAModel.replaceOne({name: mFA.name}, mFA)
        res.sendStatus(StatusCodes.OK)
    } else {
        // creating FA
        logger.info(`creating FA ${mFA.name}`)
        await FAModel.create(mFA);
        res.sendStatus(StatusCodes.CREATED)
    }
}