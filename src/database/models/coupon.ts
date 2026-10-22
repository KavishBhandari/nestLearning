import mongoose from "mongoose";
import { CouponInterface, CouponType } from "../Interface/couponInterface";
import models from "../../utils/modelName";

export const couponSchema = new mongoose.Schema<CouponInterface>({
    title: {
        type: String,
        required: true
    },
    code: {
        type: String,
        index:true,
        required: true
    },
    couponType: {
        type : String,
        enum : CouponType,
        requird: true,
    },
    disount: {
        type : Number,
        required : true
    },
    expiredAt: {
        type: Date,
        required: true
    },  
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref : models.User,
        required: true
    }
}, {
    timestamps: {
        createdAt: true,
        updatedAt: true
    },
    collection: "Coupon"
});