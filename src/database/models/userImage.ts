import mongoose from "mongoose";
import { userImage } from "../Interface/userImage";

export const UserImageSchema = new mongoose.Schema<userImage>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
         ref: "User",
        required: true
    },
    profilepic: {
        type:String,
        required:true
    }
});