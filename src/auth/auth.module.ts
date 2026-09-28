import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../database/models/user';
import { UserAddressSchema } from '../database/models/userAddress';
import { UserAuthTokenSchema } from '../database/models/authToken';
import { UserImageSchema } from '../database/models/userImage';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import models from '../utils/modelName';
import { RoleSchema } from '../database/models/role';

@Module({
  imports: [
    //PassportModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    MongooseModule.forFeature([
      {
        name: "User",
        schema: UserSchema
      },
      {
        name: "UserAddrress",
        schema: UserAddressSchema
      },
      {
        name: "UserAuthToken",
        schema: UserAuthTokenSchema
      },
      {
        name: "UserImage",
        schema: UserImageSchema
      },
      {
        name: models.Role,
        schema: RoleSchema
      }
    ]),// here defining all used model in this
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [
    AuthService,
    PassportModule,
  ],
})
export class AuthModule { }
