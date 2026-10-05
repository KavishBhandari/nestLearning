import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import models from "../utils/modelName"
import { BrandSchema } from '../database/models/brand';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name : models.Brand,
        schema : BrandSchema
      }
    ])
  ],
  controllers: [BrandController],
  providers: [BrandService],
})
export class BrandModule {}
