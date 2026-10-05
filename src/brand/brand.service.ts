import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import models from '../utils/modelName';
import mongoose, { Model } from 'mongoose';
import { BrandInterface } from '../database/Interface/brandInterface';
import { messages } from '../utils/constant';

@Injectable()
export class BrandService {
    constructor(
        @InjectModel(models.Brand)
        private readonly brandModel: Model<BrandInterface>

    ) { }

    addBrand = async (body : BrandInterface) => {
        return await this.brandModel.create(body);
    };

    getBrand = async (productId: string) => {
        const brand = await this.brandModel.findOne({
            _id: new mongoose.Types.ObjectId(productId),
            deleted_at: null
        });
        if (!brand) {
            throw new HttpException(messages.BRAND_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        return brand;
    };

    updateBrand = async (brandId: string, body: BrandInterface) => {
        return await this.brandModel.findByIdAndUpdate({
            _id: new mongoose.Types.ObjectId(brandId),
            deleted_at: null
        }, {
            name: body.name
        },
            { new: true }
        );
    };

    deleteBrand = async (brandId: string) => {
        return await this.brandModel.findByIdAndUpdate({
            _id: new mongoose.Types.ObjectId(brandId),
            deleted_at: null
        }, {
            deleted_at: new Date()
        });
    };


};
