import mongoose from "mongoose";

export interface authTokenInterface {
    accessToken: string,
    refreshToken : string,
    userId: mongoose.Types.ObjectId
};