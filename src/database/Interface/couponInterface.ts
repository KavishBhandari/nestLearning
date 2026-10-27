import mongoose from "mongoose";

export const CouponType = ["amount", "percent"] as const;

export interface CouponInterface {
    title : string;
    code : string;
    expiredAt : Date;
    couponType: (typeof CouponType)[number]; 
    disount : number;
    createdBy : mongoose.Types.ObjectId
}

export interface CouponTypeInterface {
    amount : number;
    percent :  number
};