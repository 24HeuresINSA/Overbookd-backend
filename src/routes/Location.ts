import {Request, Response} from "express";
import StatusCodes from "http-status-codes";
import logger from "@shared/Logger";
import LocationModel, {ILocation} from "@entities/Location";

export async function getLocations(req: Request, res: Response) {
    const locations = await LocationModel.find({});
    res.json(locations);
}

export async function createLocation(req: Request, res: Response) {
    const mLocation = <ILocation>req.body;
    const newLoc = await LocationModel.create(mLocation);
    return res.status(StatusCodes.CREATED).json(newLoc);
}

export async function deleteLocation(req: Request, res: Response) {
    const { id } = req.params;
    const deleted = await LocationModel.findByIdAndDelete(id);
    if (!deleted) {
        logger.info(`Location with id ${id} not found`);
        res.status(StatusCodes.NOT_FOUND).json({
            message: `Location with id ${id} not found`
        });
    } else {
        res.status(StatusCodes.OK).json(deleted);
    }
}

export async function getLocationById(req: Request, res: Response) {
    const { id } = req.params;
    const location = await LocationModel.findById(id);
    if (!location) {
        logger.info(`Location with id ${id} not found`);
        res.status(StatusCodes.NOT_FOUND).json({
            message: `Location with id ${id} not found`
        });
    }
    res.json(location);
}

export async function createManyLocations(req: Request, res: Response) {
    const mLocations = <ILocation[]>req.body;
    const newLocs = await LocationModel.insertMany(mLocations);
    return res.status(StatusCodes.CREATED).json(newLocs);
}

export async function setLocation(req: Request, res: Response) {
    const mLocation = <ILocation>req.body;
    if (await LocationModel.exists({ name: mLocation.name })) {
        // this Location already exists so update it
        logger.info(`updating location ${mLocation.name}`);
        await LocationModel.replaceOne({name: mLocation.name}, mLocation);
        return res.status(StatusCodes.OK).json(mLocation);
    }else{
        //create location if does not exist
        logger.info(`creating location ${mLocation.name}`);
        const newLoc = await LocationModel.create(mLocation);
        return res.status(StatusCodes.CREATED).json(newLoc);
    }
}

