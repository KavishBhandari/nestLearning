import mongoose from "mongoose";
import { categoryInterface } from "../Interface/categoryInterface";

export const CategorySchema = new mongoose.Schema<categoryInterface>({
    categoryName: { type: String, required: true },
    deleted_at: { type: Date, required: false }
}, {
    timestamps: { createdAt: true, updatedAt: true },
});