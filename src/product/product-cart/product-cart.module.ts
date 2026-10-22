import { Module } from '@nestjs/common';
import { ProductCartService } from './product-cart.service';
import { ProductCartController } from './product-cart.controller';
import { AuthModule } from '../../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import models from '../../utils/modelName';
import { ProductCart } from '../../database/models/productCart';
import { CouponModule } from '../../coupon/coupon.module';
import { couponSchema } from '../../database/models/coupon';

@Module({
  imports : [
    AuthModule,
    CouponModule,
    MongooseModule.forFeature([
      {
        name : models.ProductCart,
        schema: ProductCart
      },
      {
        name : models.Coupon,
        schema : couponSchema
      }
    ])
  ],
  controllers: [ProductCartController],
  providers: [ProductCartService],
})
export class ProductCartModule {}
