import mongoose from "mongoose";

export interface ProductReviewInterface {
    rating: number;
    comment: string;
    reviewerName: string;
    reviewerEmail: string;
    productId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    deleted_at?: Date | null;
};