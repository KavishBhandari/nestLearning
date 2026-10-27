import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import models from '../utils/modelName';
import mongoose, { Model } from 'mongoose';
import { CouponInterface } from '../database/Interface/couponInterface';
import { CreateCouponDto } from './dto/createCouponDto';
import { messages } from '../utils/constant';


@Injectable()
export class CouponService {
    constructor(
        @InjectModel(models.Coupon)
        private readonly couponModel: Model<CouponInterface>
    ) { }

    async isCouponAlreadyExist(code: string, title: string) {
        const couponData = await this.couponModel.findOne({
            $or: [
                {
                    code
                },
                { title }
            ]
        });
        if (couponData) {
            console.log(couponData);
            if (couponData?.code === code) {
                throw new HttpException(messages.COUPON_CODE_ALREADY_EXIST, HttpStatus.BAD_REQUEST);
            }
            if (couponData?.title === title) {
                throw new HttpException(messages.COUPON_TITLE_ALREADY_EXIST, HttpStatus.BAD_REQUEST);
            }
        }
        return;
    };

    craeteCoupon = async (body: CreateCouponDto, userId: string) => {
        body.expiredAt = new Date(body.expiredAt);

        return await this.couponModel.create({
            ...body,
            createdBy: new mongoose.Types.ObjectId(userId)
        });
    };

    getCoupon = async (couponId: string) => {
        console.log("getCoupon expiredAt ::::::::::", new Date());
        const couponData = await this.couponModel.findOne({
            _id: new mongoose.Types.ObjectId(couponId),
            expiredAt: { $gte: new Date() }
        }).select("_id code title couponType disount");
        if (!couponData) {
            throw new NotFoundException({ message: messages.COUPON_NOT_FOUND, statusCode: HttpStatus.NOT_FOUND })
        }
        return couponData;
    };

    getCouponByCode = async (code?: string) => {
        const getCoupon = await this.couponModel.findOne({
            code: code,
            expiredAt: { $gte: new Date() }
        }).select("_id code title couponType disount");
        if (!getCoupon) {
            throw new NotFoundException({ message: messages.COUPON_NOT_FOUND, statusCode: HttpStatus.NOT_FOUND })
        }
        return getCoupon;
    };
}
