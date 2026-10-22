import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import models from '../../utils/modelName';
import mongoose, { Model } from 'mongoose';
import { ProductCartInterface } from '../../database/Interface/productCart';
import { AddToCartProductDto } from './dto/addProductCartDto';
import { CouponInterface } from '../../database/Interface/couponInterface';
import { GST_RATE, messages, SHIPPING_CHARGE } from '../../utils/constant';

@Injectable()
export class ProductCartService {
    constructor(
        @InjectModel(models.ProductCart)
        private readonly productcartModel: Model<ProductCartInterface>,

        @InjectModel(models.Coupon)
        private readonly couponModel: Model<CouponInterface>
    ) { }

    addCartProduct = async (body: AddToCartProductDto, userId: string) => {
        return await this.productcartModel.create({
            productID: body.productID,
            userId: new mongoose.Types.ObjectId(userId),
            quantity: body.quantity ?? 1
        });
    };

    getCartProduct = async (userId: string, couponCode?: string) => {
        const pipeline: mongoose.PipelineStage[] = [
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    deleted_at: null
                }
            },
            {
                $lookup: {
                    from: "product",
                    localField: "productID",
                    foreignField: "_id",
                    pipeline: [
                        {
                            $lookup: {
                                from: "productImages",
                                localField: "_id",
                                foreignField: "productId",
                                pipeline: [
                                    {
                                        $match: {
                                            deleted_at: null
                                        }
                                    }
                                ],
                                as: "ProductImages"
                            }
                        },
                        {
                            $lookup: {
                                from: "categories",
                                localField: "category_id",
                                foreignField: "_id",
                                as: "ProductCategory"
                            }
                        },
                        {
                            $lookup: {
                                from: "brand",
                                localField: "brand_id",
                                foreignField: "_id",
                                /*pipeline: [
                                    {
                                        $match: {
                                            deleted_at: null
                                        }
                                    }
                                ],*/
                                as: "ProductBrand"
                            }
                        },
                    ],
                    as: "Product"
                }
            },
            {
                $project: {
                    _id: 1,
                    quantity: 1,
                    "Product._id": 1,
                    "Product.name": 1,
                    "Product.title": 1,
                    "Product.description": 1,
                    "Product.price": 1,
                    "Product.brand_id": 1,
                    "Product.category_id": 1,
                    "Product.ProductImages._id": 1,
                    "Product.ProductImages.imageUrl": 1,
                    "Product.ProductCategory._id": 1,
                    "Product.ProductCategory.categoryName": 1,
                    "Product.ProductBrand._id": 1,
                    "Product.ProductBrand.name": 1,
                }
            }
        ];

        pipeline.push({
            $addFields: {
                totalPrice: {
                    $multiply: ["$quantity", { $arrayElemAt: ["$Product.price", 0] }]
                }
            }
        });

        const cartProducts = await this.productcartModel.aggregate(pipeline);
        console.log("cartProducts :::::::::::", cartProducts);

        await this.calculateSummary(Number(cartProducts[0].totalPrice), couponCode ?? '',);

        return cartProducts;
    };

    calculateSummary = async (totalPrice: number, couponCode: string,) => {

        const gstRate = GST_RATE;
        const shippingCharge = SHIPPING_CHARGE;
        let discount = 0;
        let appliedCoupon : string | null  = "";

        if (couponCode && totalPrice > 0) {
            const getCoupon = await this.couponModel.findOne({
                code: couponCode,
            }).select("_id disount couponType expiredAt code");

            if (!getCoupon) {
                throw new NotFoundException({ message: messages.COUPON_NOT_FOUND, StatusCode: HttpStatus.NOT_FOUND })
            }
            if (getCoupon.expiredAt < new Date()) {
                throw new HttpException(messages.COUPON_EXPIRED, HttpStatus.BAD_REQUEST);
            }

            if (getCoupon?.couponType === "percent") {
                discount = (totalPrice * getCoupon.disount) / 100;
            } else {
                discount = getCoupon.disount;
            }

            appliedCoupon = getCoupon.code;
        }
    };

    updateCartQuantity = async (userId: string, body: AddToCartProductDto) => {
        return await this.productcartModel.findOneAndUpdate(
            {
                userId: new mongoose.Types.ObjectId(userId),
                productID: new mongoose.Types.ObjectId(body.productID)
            },
            {
                quantity: body.quantity
            },
            {
                new: true
            }
        );
    };


};
