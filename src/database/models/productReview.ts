import mongoose from "mongoose";
import { ProductReviewInterface } from "../Interface/productReview";
import models from "../../utils/modelName";

export const ProductReviewSchema = new mongoose.Schema<ProductReviewInterface>({
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    reviewerName: {
        type: String,
        required: true
    },
    reviewerEmail: {
        type: String,
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: models.Product,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: models.User,
        required: true
    },
    deleted_at: {
        type: Date,
        default: null
    }
}, {
    collection: "productreviews"
}); 