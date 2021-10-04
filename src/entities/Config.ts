import { Schema, model } from "mongoose";

export interface IConfig {
  key: string;
  value: string;
}

const ConfigSchema = new Schema<IConfig>(
  {
    key: { type: String, required: true },
    value: { type: Object, required: true },
    description: { type: String, required: false },
  },
  { strict: false }
);

const ConfigModel = model<Config>("config", ConfigSchema);

class Config implements IConfig {
  constructor(
    public key: string,
    public value: any,
    public description: string
  ) {}
}

export default ConfigModel;
