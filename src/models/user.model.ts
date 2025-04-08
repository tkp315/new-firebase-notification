import mongoose, { Model, Schema } from "mongoose";
export enum Role{
    ADMIN='ADMIN',
    USER='USER'
}
interface UserI {
  name: string;
  email: string;
//   googleId: string;
  fcmTokens: string[];
  role:Role
}

const userSchema: Schema<UserI> = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    // googleId: {
    //   type: String,
    // },
    role:{
        type:String,
        enum:Object.values(Role),
        default:Role.USER
    },
    fcmTokens: [String],
  },
  { timestamps: true }
);


export const User:Model<UserI> = mongoose.models.User||mongoose.model<UserI>("User",userSchema)