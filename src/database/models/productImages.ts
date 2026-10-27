import mongoose from "mongoose";
import { ProductImageInterface } from "../Interface/productImages";
import models from "../../utils/modelName";

export const ProductImageSchema = new mongoose.Schema<ProductImageInterface>({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: models.Product,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    deleted_at: {
        type: Date, 
        default: null
    }
}, {
    timestamps: {
        createdAt: true,
        updatedAt: true
    },
    collection: "productImages"
});