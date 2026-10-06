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

    productListing = async () => {
        const pipeline: mongoose.PipelineStage[] = [
            {
                $lookup: {
                    from: "brand",
                    localField: "brand_id",
                    foreignField: "_id",
                    as: "Brand"
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "category_id",
                    foreignField: "_id",
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
                                as: "user"
                            }
                        }
                    ],
                    as: "reviews"
                }
            }
        ];
        const getAllProducts = await this.productModel.aggregate(pipeline);
        return getAllProducts;
    };
}
