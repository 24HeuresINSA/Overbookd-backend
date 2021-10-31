import { Schema, model } from "mongoose";
import * as Factory from "factory.ts";
import faker from "faker";

// Model interfaces

interface IExpense {
  type: "expense";
  from: string;
  to: null;
  amount: number;
  context: string;
  createdAt: Date;
  isValid: boolean;
}

interface IDeposit {
  type: "deposit";
  from: null;
  to: string;
  amount: number;
  context: null;
  createdAt: Date;
  isValid: boolean;
}

interface ITransfer {
  type: "transfer";
  from: string;
  to: string;
  amount: number;
  context: string;
  createdAt: Date;
  isValid: boolean;
}

// MOdel type regroup interfaces

export type ITransaction = IExpense | IDeposit | ITransfer;

// Mock Interfaces for data generation

export const ExpenseMock = Factory.Sync.makeFactory<IExpense>({
  createdAt: Factory.each(() => faker.datatype.datetime()),
  isValid: true,
  type: "expense",
  amount: Factory.each(() => faker.datatype.number({ min: 0 })),
  context: Factory.each(() => faker.lorem.sentence()),
  from: "user._id",
  to: null,
});

export const DepositMock = Factory.Sync.makeFactory<IDeposit>({
  type: "deposit",
  amount: Factory.each(() => faker.datatype.number({ min: 0 })),
  context: null,
  from: null,
  to: "user._id",
  isValid: true,
  createdAt: Factory.each(() => faker.datatype.datetime()),
});

export const TransferMock = Factory.Sync.makeFactory<ITransfer>({
  type: "transfer",
  amount: Factory.each(() => faker.datatype.number({ min: 0 })),
  context: Factory.each(() => faker.lorem.sentence()),
  from: "user._id",
  to: "user._id",
  isValid: true,
  createdAt: Factory.each(() => faker.datatype.datetime()),
});

// Mongoose

const TransactionSchema = new Schema<ITransaction>(
  {
    type: {
      type: String,
      enum: ["deposit", "transfer", "expense"],
      required: true,
    },
    from: { type: String },
    to: { type: String },
    amount: { type: Number, required: true },
    context: { type: String },
    isValid: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    strict: true,
  }
);

const TransactionModel = model("Transaction", TransactionSchema);
export default TransactionModel;
