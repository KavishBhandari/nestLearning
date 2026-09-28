import mongoose from "mongoose";

export interface userImage {
    userId: mongoose.Types.ObjectId,
    profilepic : string
};