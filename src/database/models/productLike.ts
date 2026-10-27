import mongoose from "mongoose";
import { ProductLike } from "../Interface/productLikeInterface";
import models from "../../utils/modelName";

export const ProductLikeSchema = new mongoose.Schema<ProductLike>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: models.User,
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: models.Product,
        required: true
    },
    isLike: {
        type: Boolean,
        required : false
    }
}, {
    timestamps: {
        createdAt: true,
        updatedAt: true
    },
    collection: "ProductLike"
});