import mongoose from "mongoose";
import { BrandInterface } from "../Interface/brandInterface";

export const BrandSchema = new mongoose.Schema<BrandInterface>({
    name: {
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
    collection: "brand"
});