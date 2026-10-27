import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import models from '../utils/modelName';
import { couponSchema } from '../database/models/coupon';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name : models.Coupon,
        schema: couponSchema
      }
    ])
  ],
  controllers: [CouponController],
  providers: [CouponService],
  exports :  [CouponService]
})
export class CouponModule {}
