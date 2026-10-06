import mongoose from "mongoose";
import { ProductInterface } from "../Interface/produtInterface";
import models from "../../utils/modelName";

export const ProductSchema = new mongoose.Schema<ProductInterface>({
    name: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    brand_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: models.Brand,
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
    collection: "product"
});