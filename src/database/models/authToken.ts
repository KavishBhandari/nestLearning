import mongoose from "mongoose";
import { authTokenInterface } from "../Interface/authTokenInterface.";

export const UserAuthTokenSchema = new mongoose.Schema<authTokenInterface>({
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});