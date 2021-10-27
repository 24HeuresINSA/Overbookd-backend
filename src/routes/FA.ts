import FAModel, {IFA} from "@entities/FA";
import {Request, Response} from "express";
import logger from "@shared/Logger";
import StatusCodes from "http-status-codes";

export async function getFAs(req: Request, res: Response) {
  const FAs = await FAModel.find({});
  logger.info("getting all FAs");
  res.json(FAs);
}

export async function getFAByCount(req: Request, res: Response) {
  if (req.params.id === undefined) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "FA must contain an id" });
  }
  logger.info(`getting info ${req.params.id}`);
  // @ts-ignore
  const mFAQuery = await FAModel.findOne({ count: +req.params.id });
  if (mFAQuery) {
    const mFA = mFAQuery.toObject();
    // if (mFA && mFA.FTs) {
    //   let FTs = mFA.FTs.map(async (FTID) => await FTModel.findById(FTID));
    //   // @ts-ignore
    //   FTs = await Promise.all(FTs);
    //   // @ts-ignore
    //   mFA.FTs = FTs;
    // }
    res.json(mFA);
  }else {
        res.sendStatus(StatusCodes.BAD_REQUEST)
    }
}

export async function setFA(req: Request, res: Response) {
  const mFA = <IFA>req.body;
  if (await FAModel.exists({ count: mFA.count })) {
    // this FA already exists so update it
    logger.info(`updating FA ${mFA.count}`);
    await FAModel.replaceOne({count: mFA.count}, mFA);
    res.sendStatus(StatusCodes.OK);
  }
}

export async function createFA(req: Request, res: Response) {
  const mFA = <IFA>req.body;
  mFA.count = (await FAModel.countDocuments()) + 1;
  // creating FA
  // @ts-ignore
  logger.info(`creating FA ${mFA.general.name} id: ${mFA.count}`);
  await FAModel.create(mFA);
  res.sendStatus(StatusCodes.CREATED);
}
