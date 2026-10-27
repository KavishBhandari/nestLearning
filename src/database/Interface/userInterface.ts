import mongoose from "mongoose";

export interface userInterface {
    name: string,
    email: string,
    password: string,
    roleId: mongoose.Types.ObjectId
    deleted_at?:Date
};