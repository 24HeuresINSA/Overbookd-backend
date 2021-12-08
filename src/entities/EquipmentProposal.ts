import { model, Schema, Types } from 'mongoose';
import { IEquipment } from './Equipment';

export interface IEquipmentProposal extends IEquipment {
    isNewEquipment: boolean;
    oldEquipment?: Types.ObjectId;
}

const EquipmentProposalSchema = new Schema({
    isNewEquipment: { type: Boolean, required: true },
    oldEquipment: { type: Schema.Types.ObjectId, ref: 'Equipment' },   
}, { strict: false });

const EquipmentProposalModel = model<IEquipmentProposal>('EquipmentProposal', EquipmentProposalSchema);

export default EquipmentProposalModel;