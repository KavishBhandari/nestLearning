import { Body, Controller, Get, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

import { CategoryService } from './category.service';
import { CategoryDto } from './dto/categoryDto';
import { messages } from '../utils/constant';
import mongoose from 'mongoose';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { loginUser } from '../decorator/loginUser';
import type { authPayloadInterface } from '../auth/strategies/jwt.strategy';
//import { authPayloadInterface } from '../auth/strategies/jwt.strategy';

@Controller('category')
export class CategoryController {
  constructor(
    @InjectConnection()
    private readonly connection: mongoose.Connection,//for transaction
    private readonly categoryService: CategoryService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post("add")
  async addCategory(@Body() categoryDto: CategoryDto) {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      await this.categoryService.isCategoryAlreadyExist(categoryDto.categoryName);
      const category = await this.categoryService.addCategory(categoryDto);
      await session.commitTransaction();
      return {
        statusCode: HttpStatus.OK,
        message: messages.CATEGORY_CREATED_SUCCESS,
        data: {
          category
        }
      };
    } catch (error) {
      console.error(error);
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  };

  @UseGuards(JwtAuthGuard)
  @Patch("update/:id")
  async updateCategory(
    @Param('id') id: string,
    @Body() categoryDto: CategoryDto
  ) {
    await this.categoryService.updateCategory(id, categoryDto);
    return {
      statusCode: HttpStatus.OK,
      message: messages.CATEGORY_UPDATED_SUCCESS,
      data: {}
    };
  };

  @UseGuards(JwtAuthGuard)
  @Patch("delete/:id")
  async deleteCategory(
    @Param('id') id: string,
  ) {
    await this.categoryService.deleteCategory(id);
    return {
      statusCode: HttpStatus.OK,
      message: messages.CATEGORY_DELETED_SUCCESS,
      data: {}
    };
  };

  @UseGuards(JwtAuthGuard)
  @Get("get/:id")
  async getCategory(
    @Param("id") id: string,
    @loginUser() user: authPayloadInterface
  ) {
    console.log("user :::::::::", user)
    const category = await this.categoryService.getCategory(id);
    return {
      statusCode: HttpStatus.OK,
      message: messages.CATEGORY_FETCH_SUCCESS,
      data: {
        category
      }
    };
  };



}
