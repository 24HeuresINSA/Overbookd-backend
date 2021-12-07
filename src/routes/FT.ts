import StatusCodes from "http-status-codes";
import {Request, Response} from "express";
import FTModel, {IFT} from "@entities/FT";
import logger from "@shared/Logger";
import FAModel from "@entities/FA";

export async function getAllFTs(req: Request, res: Response) {
  const mFTs = await FTModel.find({});
  res.json({data: mFTs});
}

export async function getFTByID(req: Request, res: Response) {
  const mFT = await FTModel.findOne({count: +req.params.FTID});
  res.json(mFT);
}

export async function createFT(req: Request, res: Response) {
  const mFT = <IFT>req.body;
  const count = await FTModel.countDocuments();
  mFT.count = count + 1
  const FT = await FTModel.create(mFT);
  res.json(FT);
}

export async function updateFT(req: Request, res: Response) {
  const mFT = <IFT>req.body;
  if (mFT._id) {
    //@ts-ignore
    await FTModel.findByIdAndUpdate(mFT._id, mFT);
    res.sendStatus(StatusCodes.OK);
  } else {
    res.sendStatus(StatusCodes.BAD_REQUEST);
  }
}

export async function unassign(req: Request, res: Response) {
  // unassign a user from an FT
  // const { FTID, _id } = req.body;
  // const FT = await FTModel.findById(FTID);
  // if (FT) {
  //   const mFT = <IFT>FT.toObject();
  //   mFT.schedules?.forEach((schedule) => {
  //     if (schedule.assigned) {
  //       schedule.assigned = schedule.assigned.filter(
  //         (assign) => assign._id !== _id
  //       );
  //     }
  //   });
  //   logger.info(`unassigning ${FTID}`);
  //   await FTModel.findByIdAndUpdate(FTID, {
  //     schedules: mFT.schedules,
  //   });
  // }
}

export async function deleteFT(req: Request, res: Response) {
  const mFT = <IFT>req.body;
  logger.info(`deleting FT: ${mFT.count}...`)
  if (mFT.count) {
    await FTModel.findOneAndUpdate({count: mFT.count}, {$set: {isValid: false}});
    if (mFT.FA) {
      logger.info(`deleting FT: ${mFT.count} from FA ${mFT.FA}`)
      let mFA = await FAModel.findOne({count: mFT.FA});
      if (mFA && mFA.FTs) {
        mFA.FTs = mFA.FTs.filter((FT: IFT) => FT.count !== mFT.count);
        mFA.save()
        logger.info(`deleted FT`)
      }
    }
    res.status(StatusCodes.OK).json({mFT});
  } else {
    res.sendStatus(StatusCodes.BAD_REQUEST);
  }
}
