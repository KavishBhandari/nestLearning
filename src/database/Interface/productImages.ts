import mongoose from "mongoose";

export interface ProductImageInterface {
    productId: mongoose.Types.ObjectId;
    imageUrl: string;
    deleted_at?: Date | null
};