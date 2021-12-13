import { model, Schema, Types } from 'mongoose';
import { IEquipment } from './Equipment';

export interface IEquipmentProposal extends IEquipment {
    isNewEquipment: boolean;
    oldEquipment?: Types.ObjectId;
    byUser: Types.ObjectId;
}

const EquipmentProposalSchema = new Schema({
    isNewEquipment: { type: Boolean, required: true },
    oldEquipment: { type: Schema.Types.ObjectId, ref: 'Equipment' },   
    byUser: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    isValid: { type: Boolean, default: true },
    amount: { type: Number, required: true },
    comment: { type: String },
    location: { type: String, required: true },
    preciseLocation: { type: String },
    borrowed: { type: Array },
    referencePicture: { type: String },
    referenceInvoice: { type: String },
    type: { type: String, required: true },
    fromPool: { type: Boolean, default: false },
});

const EquipmentProposalModel = model<IEquipmentProposal>('EquipmentProposal', EquipmentProposalSchema);

export default EquipmentProposalModel;