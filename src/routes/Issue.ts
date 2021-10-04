import { Request, Response } from "express";
import axios from "axios";

export default async function issueHandler(req: Request, res: Response) {
  const body = req.body;
  const isFeatureRequest = body.json;
  const issueWebserviceURL = process.env.WEBSERVICE_URL || "localhost:5000/";
  if (isFeatureRequest) {
    await axios.post(issueWebserviceURL + "/feature", body);
  } else {
    await axios.post(issueWebserviceURL + "/bug", body);
  }
}
