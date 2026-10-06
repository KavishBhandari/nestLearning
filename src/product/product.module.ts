import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import models from '../utils/modelName';
import { ProductSchema } from '../database/models/product';
import { ProductImageSchema } from '../database/models/productImages';
import { ProductReviewSchema } from '../database/models/productReview';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name: models.Product,
        schema: ProductSchema
      },
      {
        name: models.ProductImage,
        schema: ProductImageSchema
      },
      {
        name: models.ProductReview,
        schema: ProductReviewSchema
      }
    ])
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule { }
