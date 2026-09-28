import mongoose from "mongoose";

export interface userAddressInterface {
    city:string,
    address : string,
    userId:  mongoose.Types.ObjectId
}