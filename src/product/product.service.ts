import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import models from '../utils/modelName';
import mongoose, { Model } from 'mongoose';
import { ProductInterface } from '../database/Interface/produtInterface';
import { ProductImageInterface } from '../database/Interface/productImages';
import { ProductReviewInterface } from '../database/Interface/productReview';
import { HttpException, HttpStatus } from '@nestjs/common';
import { messages } from '../utils/constant';
import { ProductCreationDto } from './dto/productCreation.dto';
import { authPayloadInterface } from '../auth/strategies/jwt.strategy';
import commonHelper from '../helpers/commonHelper.';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(models.Product)
        private readonly productModel: Model<ProductInterface>,

        @InjectModel(models.ProductImage)
        private readonly productImageModel: Model<ProductImageInterface>,

        @InjectModel(models.ProductReview)
        private readonly productReviewModel: Model<ProductReviewInterface>
    ) { }

    isProdutAlreadyExist = async (name: string) => {
        const getProduct = await this.productModel.findOne({
            name: name,
            deleted_at: null
        }).select("_id");
        if (getProduct) {
            throw new HttpException(messages.PRODUCT_ALREADY_EXIST, HttpStatus.BAD_REQUEST);
        };
        return;
    };

    addProduct = async (body: ProductCreationDto) => {
        return await this.productModel.create({
            name: body.name,
            title: body.title,
            description: body.description,
            price: body.price,
            brand_id: body.brand_id,
            category_id: body.category_id
        });
    };

    addProductImage = async (productId: mongoose.Types.ObjectId, productImage: string) => {
        const product_id = new mongoose.Types.ObjectId(productId);

        const productImgURL = `http://localhost:3000/public/productImages/${productImage}`;

        return await this.productImageModel.create({
            productId: product_id,
            imageUrl: productImgURL
        });
    };

    isReviewAlreadyExist = async (productId: string, userId: string) => {
        const getReview = await this.productReviewModel.findOne({
            productId: new mongoose.Types.ObjectId(productId),
            userId: new mongoose.Types.ObjectId(userId),
        }).select("_id");
        if (getReview) {
            throw new HttpException(messages.REVIEW_ALREADY_EXIST, HttpStatus.BAD_REQUEST);
        };
        return;
    };

    addProdutReview = async (productId: string, user: authPayloadInterface, body: any, userName: string) => {
        return await this.productReviewModel.create({
            productId: new mongoose.Types.ObjectId(productId),
            userId: new mongoose.Types.ObjectId(user._id),
            rating: body.rating,
            comment: body.comment,
            reviewerEmail: user.email,
            reviewerName: userName
        });
    };

    productListing = async (query: { page: string, limit: string, search?: string, sortBy: string, sortOrder: string, minPrice?: number, maxPrice?: number, category_id?: string, minRating?: number, categoryName?: string }) => {

        const getPaginaton = commonHelper.getPagination(query);

        // Build initial $match with price range and category filters
        const matchStage: Record<string, any> = { deleted_at: null };

        if (query.minPrice !== undefined || query.maxPrice !== undefined) {
            matchStage.price = {};
            if (query.minPrice !== undefined) {
                matchStage.price.$gte = +query.minPrice;
            }
            if (query.maxPrice !== undefined) {
                matchStage.price.$lte = +query.maxPrice;
            }
        }

        /*if (query.categoryName) {
            matchStage.category.categoryName = query.categoryName;
        }*/

        if (query.category_id) {
            matchStage.category_id = new mongoose.Types.ObjectId(query.category_id);
        }

        const pipeline: mongoose.PipelineStage[] = [
            {
                $match: matchStage
            },
            {
                $lookup: {
                    from: "productImages",
                    localField: "_id",
                    foreignField: "productId",
                    as: "ProductImages"
                }
            },
            {
                $lookup: {
                    from: "brand",
                    localField: "brand_id",
                    foreignField: "_id",
                    /*pipeline: [
                        { $match: { deleted_at: null } }
                    ],*/
                    as: "Brand"
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "category_id",
                    foreignField: "_id",
                    pipeline: [
                        {
                            $match: {
                                deleted_at: null
                            }
                        }
                    ],
                    as: "category"
                }
            },
            {
                $lookup: {
                    from: "productreviews",
                    localField: "_id",
                    foreignField: "productId",
                    pipeline: [
                        { $match: { deleted_at: null } },
                        {
                            $lookup: {
                                from: "users",
                                localField: "userId",
                                foreignField: "_id",
                                pipeline: [
                                    {
                                        $match: {
                                            deleted_at: null
                                        }
                                    }
                                ],
                                as: "user"
                            }
                        }
                    ],
                    as: "reviews"
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    title: 1,
                    description: 1,
                    price: 1,
                    brand_id: 1,
                    category_id: 1,
                    "ProductImages._id": 1,
                    "ProductImages.productId": 1,
                    "ProductImages.imageUrl": 1,
                    "Brand._id": 1,
                    "Brand.name": 1,
                    "category._id": 1,
                    "category.categoryName": 1,
                    "reviews._id": 1,
                    "reviews.rating": 1,
                    "reviews.comment": 1,
                    "reviews.reviewerName": 1,
                    "reviews.user._id": 1,
                    "reviews.user.name": 1,
                    "reviews.user.email": 1,
                    averageRating: 1,
                }
            },
            {
                $unwind: { path: "$Brand" },
            },
            {
                $unwind : {path : "$category"}
            }
        ];

        // Filter by category name (after the categories lookup)
        if (query.categoryName) {
            pipeline.push({
                $match: {
                    "category.categoryName": {
                        $regex: query.categoryName,
                        $options: "i"   // case-insensitive exact match
                    }
                }
            });
        }

        // Compute average rating from reviews
        pipeline.push({
            $addFields: {
                averageRating: {
                    $cond: {
                        if: { $gt: [{ $size: "$reviews" }, 0] },
                        then: { $avg: "$reviews.rating" },
                        else: 0
                    }
                }
            }
        });

        // Filter by minimum average rating
        if (query.minRating !== undefined) {
            pipeline.push({
                $match: {
                    averageRating: { $gte: +query.minRating }
                }
            });
        }

        if (query.search) {
            pipeline.push({
                $match: {
                    $or: [
                        {
                            name: {
                                $regex: query.search,
                                $options: "i"
                            }
                        },
                        {
                            "Brand.name": {
                                $regex: query.search,
                                $options: "i"
                            }
                        },
                        {
                            "category.categoryName": {
                                $regex: query.search,
                                $options: "i"
                            }
                        }
                    ]
                }
            })
        }

        if (query.sortBy) {
            const sortOrder = query.sortOrder === "desc" ? -1 : 1;
            pipeline.push({
                $sort: { [query.sortBy]: sortOrder }
            });
        }

        pipeline.push({
            $facet: {
                data: [
                    { $skip: getPaginaton.offset },
                    { $limit: getPaginaton.limit },
                ],
                totalCount: [{ $count: 'count' }],
            },
        });

        const getAllProducts = await this.productModel.aggregate(pipeline);
        //console.log(" getAllProducts ::::::::::", getAllProducts[0]?.data);
        //console.log(" getAllProducts ::::::::::", getAllProducts[0]?.totalCount[0]?.count);
        const data = getAllProducts[0]?.data;
        const totalCount = getAllProducts[0]?.totalCount[0]?.count
        //return getAllProducts;
        const pagination = commonHelper.createPagination(
            totalCount,
            +query.page,
            getPaginaton.limit
        );

        return {
            data,
            pagination
        };
    };
}
