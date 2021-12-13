import { model, Schema } from "mongoose";

export interface IEquipment {
  _id?: string;
  name: string;
  isValid?: boolean;
  amount: number;
  comment?: string;
  location: string;
  preciseLocation?: string;
  borrowed?: Array<any>;
  referencePicture?: string;
  referenceInvoice?: string;
  type: string;
  fromPool?: boolean;

}

export const EquipmentSchema = new Schema<IEquipment>(
  {
    name: { type: String, required: true },
    isValid : { type: Boolean, default: true },
    amount: { type: Number, required: true },
    comment: { type: String, default: "" },
    location: { type: String, required: true },
    preciseLocation: { type: String, default: "" },
    borrowed: { type: Array, default: [] },
    referencePicture: { type: String, default: "" },
    referenceInvoice: { type: String, default: "" },
    type: { type: String, required: true },
    fromPool: { type: Boolean, default: false },
  }
);

const EquipmentModel = model<IEquipment>("Equipment", EquipmentSchema);


export default EquipmentModel;
