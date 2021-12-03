import { model, Schema, Types } from 'mongoose';
import EquipmentModel, { IEquipment, EquipmentSchema } from './Equipment';

export interface IEquipmentProposal extends IEquipment {
    isNewEquipment: boolean;
    oldEquipment?: Types.ObjectId;
}

const EquipmentProposalSchema = new Schema({
    isNewEquipment: { type: Boolean, required: true },
    oldEquipment: { type: Schema.Types.ObjectId, ref: 'Equipment' },
});

const EquipmentProposalModel = EquipmentModel.discriminator('EquipmentProposal', EquipmentProposalSchema);

export default EquipmentProposalModel;