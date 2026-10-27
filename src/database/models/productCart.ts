import mongoose from "mongoose";
import { ProductCartInterface } from "../Interface/productCart";
import models from "../../utils/modelName";

export const ProductCart = new mongoose.Schema<ProductCartInterface>({
    productID: {
        type: mongoose.Schema.ObjectId,
        ref: models.Product,
        required: true
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: models.User,
        required: true
    },
    quantity: {
        type: Number,
        default:1
    },
    deleted_at: {
        type: Date,
        default: null
    }
}, {
    timestamps : {
        createdAt :  true,
        updatedAt: true
    },
    collection: "ProductCart"
}); 