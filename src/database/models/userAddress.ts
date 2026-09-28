import mongoose from "mongoose";
import { userAddressInterface } from "../Interface/userAddressInterface.";

export const UserAddressSchema = new mongoose.Schema<userAddressInterface>({
    city: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},
    {
        collection: 'useraddresses',
    },);