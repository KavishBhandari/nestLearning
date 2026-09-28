import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { MongooseModule } from '@nestjs/mongoose';
import models from '../utils/modelName';
import { RoleSchema } from '../database/models/role';

@Module({
  imports:[
    MongooseModule.forFeature([
        {
          name: models.Role,
          schema: RoleSchema
        },
    ])
  ],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
