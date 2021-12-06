import { model, Schema } from "mongoose";

export interface IEquipment {
  _id?: string;
  name: string;
  isValid: boolean;
  amount: number;
}

const options = { discriminatorKey: "kind", strict: false };
export const EquipmentSchema = new Schema<IEquipment>(
  {
    name: { type: String, required: true },
    isValid : { type: Boolean, default: true },
  },
  options
);

const EquipmentModel = model<IEquipment>("Equipment", EquipmentSchema);


export default EquipmentModel;
