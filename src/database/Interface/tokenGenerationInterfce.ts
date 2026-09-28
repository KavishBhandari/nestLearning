import mongoose from "mongoose";

export interface tokenGenerationInterface{
    _id:string,
    email:string,
    roleId:mongoose.Types.ObjectId
}