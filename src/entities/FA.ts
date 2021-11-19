import {model, Schema} from "mongoose";
import {IFT} from "@entities/FT";

export interface ITimeframe {
  start: string;
  end: string;
}

class timeframe implements ITimeframe {
  constructor(public start: string, public end: string) {}
}


export interface IForm {
  _id: string;
  comments: any[];
  refused: string[];
  validated: string[];
  general: {};
  count: number;
  isValid: boolean;
  equipments: any[];
  status: string;
}

export interface IFA extends IForm {
  timeframes: ITimeframe[];
  details: {};
  security: {};
  name: string;
  FTs: Partial<IFT>[];
}

const FASchema = new Schema<IFA>(
  {
    name: {type: String, required: false},
    FTs: {type: Array, required: false},
  },
  { strict: false }
);

const FAModel = model<FA>("FA", FASchema);

class FA implements IFA {
  FTs = [];

  constructor(public name: string, public count: number) {
  }

  comments: any[] = [];
  general = {};
  refused = [];
  validated = [];
  details = {};
  equipments = [];
  security = {};
  status = "draft";
  timeframes = [];
  isValid = true;
  _id = "";

}

export default FAModel;
