import { model, Schema, Types } from "mongoose";
import * as Factory from "factory.ts";
import faker from "faker";

export interface IUser {
  password?: string;
  password2?: string;
  notifications?: any[];
  _id?: string;
  id?: number;
  firstname: string;
  lastname: string;
  nickname?: string;
  balance?: number;
  charisma?: number;
  phone?: number;
  picture?: number;
  email: string;
  team?: string[];
  hasDriverLicense?: boolean;
  birthday?: Date;
  friends?: string[];
  transactionHistory?: any;
  pp?: string;
  availabilities?: Types.ObjectId[];
  resetPasswordToken?: string;
  resetTokenExpires?: Date;
}

// Mock interface for data generation

export const UserMock = Factory.Sync.makeFactory<IUser>({
  firstname: Factory.Sync.each(() => faker.name.firstName()),
  lastname: Factory.Sync.each(() => faker.name.lastName()),
  email: Factory.Sync.each(() => faker.internet.email()),
});

const UserSchema = new Schema<IUser>(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    nickname: { type: String, required: false },
    password: { type: String, require: false },
    balance: { type: Number, required: false },
    charisma: { type: Number, required: false },
    phone: { type: Number, required: false },
    picture: { type: String, required: false },
    email: { type: String, required: true },
    team: { type: Array, required: false },
    hasDriverLicense: { type: Boolean, required: false },
    birthday: { type: Date, required: false },
    friends: { type: Array, required: false },
    pp: { type: String, required: false },
    availabilities: { type: [Schema.Types.ObjectId], required: false },
    resetPasswordToken: { type: String, required: false },
    resetTokenExpires: { type: Date, required: false },
  },
  { strict: false }
);

export class SafeUser {
  _id?: string;
  firstname: string;
  lastname: string;
  nickname?: string;
  balance?: number;
  charisma?: number;
  phone?: number;
  picture?: number;
  email: string;
  team?: string[];
  hasDriverLicense?: boolean;
  birthday?: Date;
  friends?: string[];
  pp?: string;
  availabilities?: Types.ObjectId[];
  resetPasswordToken?: string;
  resetTokenExpires?: Date;

  constructor(data: IUser) {
    this._id = data._id;
    this.firstname = data.firstname;
    this.lastname = data.lastname;
    this.nickname = data.nickname;
    this.balance = data.balance;
    this.charisma = data.charisma;
    this.phone = data.phone;
    this.picture = data.picture;
    this.email = data.email;
    this.team = data.team;
    this.hasDriverLicense = data.hasDriverLicense;
    this.birthday = data.birthday;
    this.friends = data.friends;
    this.pp = data.pp;
    this.availabilities = data.availabilities;
  }
}

const UserModel = model<IUser>("User", UserSchema);

export default UserModel;
