import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import models from '../utils/modelName';
import { CategorySchema } from '../database/models/category';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
      AuthModule,
      MongooseModule.forFeature([
        {
          name: models.Category,
          schema: CategorySchema
        },
        
      ]),// here defining all used model in this
    ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
