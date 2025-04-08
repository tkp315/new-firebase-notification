import mongoose, { Model, Schema } from "mongoose";

interface INotification{
    header: string;
    message:string
    actionUrl?:string;
}

const notificationSchema:Schema<INotification> = new Schema({
message:{
    type:String
},
header:{
    type:String
},
actionUrl:{
    type:String
}
},{timestamps:true})

export const Notification:Model<INotification> = mongoose.models.Notification || mongoose.model<INotification>("Notification",notificationSchema)