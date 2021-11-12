import {model, Schema} from "mongoose";
import {ITimeframe} from "@entities/avalibilities";

export interface IFA {
  isValid: boolean;
  equipments: any[];
  status: string;
  timeframes: ITimeframe[];
  details: {};
  security: {};
  comments: any[];
  refused: string[];
  validated: string[];
  general: {};
  count: number;
  name: string;
  FTs: Record<string, unknown>[];
}

const FASchema = new Schema<IFA>(
  {
    name: {type: String, required: false},
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

}

export default FAModel;
