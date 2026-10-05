import { Body, Controller, Get, Post, HttpStatus, Param, Put } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandDto } from './dto/brand.dto';
import { messages } from '../utils/constant';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) { }

  @Post("addBrand")
  async addBrand(@Body() body: BrandDto) {
    const brand = await this.brandService.addBrand(body);
    return {
      statusCode: HttpStatus.OK,
      message: messages.BRAND_CREATED_SUCCESS,
      data: brand
    }
  };

  @Get("getBrand/:productId")
  async getBrand(@Param('productId') productId: string) {
    const fetchedBrand = await this.brandService.getBrand(productId);
    return {
      statusCode: HttpStatus.OK,
      message: messages.BRAND_FETCHED_SUCCESS,
      data: fetchedBrand
    }
  };

  @Put("updateBrand/:brandId")
  async updateBrand(@Param('brandId') brandId: string, @Body() body: BrandDto) {
    const updatedBrand = await this.brandService.updateBrand(brandId, body);
    return {
      statusCode: HttpStatus.OK,
      message: messages.BRAND_UPDATED_SUCCESS,
      data: updatedBrand
    }
  };

  @Put("deleteBrand/:brandId")
  async deleteBrand(@Param("brandId") brandId: string) {
    const deletedBrand = await this.brandService.deleteBrand(brandId);
    return {
      statusCode: HttpStatus.OK,
      message: messages.BRAND_DELETED_SUCCESS,
      data: {}
    }
  };

};

