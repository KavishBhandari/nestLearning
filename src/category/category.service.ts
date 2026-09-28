import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import models from '../utils/modelName';
import mongoose, { Model } from 'mongoose';
import { categoryInterface } from '../database/Interface/categoryInterface';
import { messages } from '../utils/constant';

@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(models.Category)
        private readonly categoryModel: Model<categoryInterface>,
    ) { }

    addCategory = async (body: categoryInterface) => {
        return await this.categoryModel.create(body);
    }

    getCategory = async (categoryId: string) => {
        const category = await this.categoryModel.findOne({
            _id: new mongoose.Types.ObjectId(categoryId),
            deleted_at: null
        });
        if (!category) {
            throw new HttpException(messages.CATEGORY_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        return category;
    }

    updateCategory = async (categoryId: string, body: categoryInterface) => {
        return await this.categoryModel.findByIdAndUpdate({
            _id: new mongoose.Types.ObjectId(categoryId),
            deleted_at: null
        }, {
            categoryName: body.categoryName
        },
            { new: true }
        );
    };

    deleteCategory = async (categoryId: string) => {
        return await this.categoryModel.findByIdAndUpdate({
            _id: new mongoose.Types.ObjectId(categoryId),
            deleted_at: null
        }, {
            deleted_at: new Date()
        });
    };

    isCategoryAlreadyExist = async (categoryName:string) => {
        const category = await this.categoryModel.findOne({
            categoryName
        }).select("categoryName");

        if(category){
            throw new HttpException(messages.CATEGORY_ALREADY_EXIST, HttpStatus.BAD_REQUEST);
        }
        return;
    };
}
