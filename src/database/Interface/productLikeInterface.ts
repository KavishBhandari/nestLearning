import mongoose from "mongoose";

export interface ProductLike {
    userId: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;
    isLike : boolean
};