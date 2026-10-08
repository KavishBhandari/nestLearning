import { ProductService } from './product.service';
import { Body, Controller, Get, Post, HttpStatus, Param, Put, UseInterceptors, UploadedFile, UseGuards, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductCreationDto } from './dto/productCreation.dto';
import { messages, productImagesUploadedPath, userProfilePicSize } from '../utils/constant';
import commonHelper from '../helpers/commonHelper.';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { loginUser } from '../decorator/loginUser';
import type { authPayloadInterface } from '../auth/strategies/jwt.strategy';
import { ProductReviewDto } from './dto/productReview.dto';
import { AuthService } from '../auth/auth.service';
import { QueryDto } from '../auth/dto/common-query.dto';

@Controller('product')
export class ProductController {
  constructor(
    @InjectConnection()
    private readonly connection: mongoose.Connection,//for transaction
    private readonly productService: ProductService,
    private readonly authService : AuthService
  ) { }

  @Post("addProduct")
  @UseInterceptors(
    FileInterceptor(
      "produtImage",
      commonHelper.imageUploadConfig(
        productImagesUploadedPath,
        userProfilePicSize
      )
    )
  )
  async addProduct(@Body() body: ProductCreationDto, @UploadedFile() file: Express.Multer.File) {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      await this.productService.isProdutAlreadyExist(body.name);
      const product = await this.productService.addProduct(body);
      await this.productService.addProductImage(product._id, file.filename);
      await session.commitTransaction();
      return {
        statusCode: HttpStatus.OK,
        message: messages.PRODUCT_CREATED_SUCCESS,
        data: {
          product
        }
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  };

  @Post("addProductReview")
  @UseGuards(JwtAuthGuard)
  async addProdutReview(@Body() body: ProductReviewDto, @loginUser() user: authPayloadInterface) {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      await this.productService.isReviewAlreadyExist(body.productId, user?._id);
      const getUserName = await this.authService.isUserValid(user.email);
      await this.productService.addProdutReview(body.productId, user, body, getUserName.name);
      await session.commitTransaction();
      return {
        statusCode: HttpStatus.OK,
        message: messages.REVIEW_CREATED_SUCCESS,
        data: {}
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  };

  @Get("productListing")
  async productListing(@Query() query : QueryDto) {
    const produts = await this.productService.productListing(query);
    return {
        statusCode: HttpStatus.OK,
        message: messages.REVIEW_CREATED_SUCCESS,
        data: {
          produts
        }
      };
  };

  async updateProduct() {

  };

  async deleteProduct() {

  };
}
