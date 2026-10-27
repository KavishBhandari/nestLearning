import mongoose from "mongoose";

export interface ProductCartInterface {
    productID : mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    quantity: number;
    deleted_at? : Date | null
};