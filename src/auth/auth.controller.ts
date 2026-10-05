import {
  Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus,
  UploadedFile, UseInterceptors,
  Query,
  UseGuards,  //both are used to upload a file
} from '@nestjs/common';
import { omit } from 'lodash';
import { SignOptions } from 'jsonwebtoken';
import { FileInterceptor } from '@nestjs/platform-express';

import { AuthService } from './auth.service';
import { CreateAuthDto, SignInDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import commonHelper from '../helpers/commonHelper.';
import { messages, roles, userProfilePicSize, userProfilePicUploadedPath } from '../utils/constant';
import { QueryDto } from './dto/common-query.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Roles } from '../decorator/roles.decorator';
import { RolesGuard } from './guards/role-gurad';
import { loginUser } from '../decorator/loginUser';
import type { authPayloadInterface } from './strategies/jwt.strategy';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("signup")
  @UseInterceptors(
    FileInterceptor(
      'profilePic',
      commonHelper.imageUploadConfig(
        userProfilePicUploadedPath,
        userProfilePicSize
      )
    ),
  )
  async signup(
    @Body() createAuthDto: CreateAuthDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    console.log("file :::::::::", file);
    await this.authService.isUserAlreadyExist(createAuthDto.email);
    createAuthDto.password = await commonHelper.hashPassword(createAuthDto.password);
    const user = await this.authService.signup(createAuthDto, file.filename);
    const userWithoutPassword = omit(user.toObject(), ['password']);
    return {
      statusCode: HttpStatus.OK,
      message: messages.USER_SIGNUP_SUCCESS,
      data: userWithoutPassword
    };
  };

  @Post("signin")
  async signin(@Body() signInDto: SignInDto) {
    const user = await this.authService.isUserValid(signInDto.email);
    await commonHelper.comparePassword(signInDto.password, user.password);
    const authToken = await commonHelper.generateAuthToken({ _id: user.id, email: user.email, roleId: user.roleId }, process.env.JWT_SECRET_KEY!, process.env.ACCESS_TOKEN_EXPIRE_TIME! as SignOptions['expiresIn']);
    const refreshToken = await commonHelper.generateAuthToken({ _id: user.id, email: user.email, roleId: user.roleId }, process.env.JWT_SECRET_KEY!, process.env.REFRESH_TOKEN_EXPIRE_TIME! as SignOptions['expiresIn']);
    await this.authService.storeAuthToken(user._id,
      authToken,
      refreshToken
    );
    return {
      statusCode: HttpStatus.OK,
      message: messages.USER_SIGNUP_SUCCESS,
      data: {
        user: user,
        accessToken: authToken,
        refreshToken
      }
    };
  };

  @Get("getOwnProfile")
  @UseGuards(JwtAuthGuard)
  async getOwnProfile( @loginUser() user: authPayloadInterface) {
    const userProfile = await this.authService.getOwnProfile(user);
    return {
      statusCode: HttpStatus.OK,
      message: messages.USER_SIGNUP_SUCCESS,
      data: {
        userProfile
      }
    };
  }

  @Get("userProfile")
  @UseGuards(JwtAuthGuard /*RolesGuard*/)
  //@Roles(roles.ADMIN)// @loginUser() user: authPayloadInterface
  async getUserProfile(
    @Query() query: QueryDto,
  ) {
    try {
      const userProfile = await this.authService.getUserProfile(query);
      return {
        statusCode: HttpStatus.OK,
        message: messages.USER_SIGNUP_SUCCESS,
        data: {
          userProfile
        }
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
