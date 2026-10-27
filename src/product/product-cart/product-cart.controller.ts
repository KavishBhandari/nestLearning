import { Body, Controller, Get, HttpStatus, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ProductCartService } from './product-cart.service';
import { AddToCartProductDto } from './dto/addProductCartDto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { loginUser } from '../../decorator/loginUser';
import type { authPayloadInterface } from '../../auth/strategies/jwt.strategy';
import { messages } from '../../utils/constant';


@Controller('product-cart')
export class ProductCartController {
  constructor(private readonly productCartService: ProductCartService) { }

  @Post("addCartProduct")
  @UseGuards(JwtAuthGuard)
  async addCartProduct(@Body() body: AddToCartProductDto, @loginUser() user: authPayloadInterface) {
    await this.productCartService.addCartProduct(body, user._id);
    return {
      statusCode: HttpStatus.OK,
      message: messages.ADD_TO_CART_PRODUCT_SUCCESS,
      data: {}
    }
  };

  @Get("getCartProduct")
  @UseGuards(JwtAuthGuard)
  async getCartProduct(@loginUser() user: authPayloadInterface, @Query() query : {couponCode? : string}) {
    const getCartProducts = await this.productCartService.getCartProduct(user._id, query?.couponCode);
    return {
      statusCode: HttpStatus.OK,
      message: messages.ADD_TO_CART_PRODUCT_SUCCESS,
      data: {
        getCartProducts
      }
    };
  };

  @Put("updateCartQuantity")
  @UseGuards(JwtAuthGuard)
  async updateCartQuantity (@loginUser() user : authPayloadInterface, @Body() body : AddToCartProductDto) {
    const cartResult = await this.productCartService.updateCartQuantity(user._id, body);
    return {
      statusCode: HttpStatus.OK,
      message: messages.ADD_TO_CART_PRODUCT_SUCCESS,
      data: {
        cartResult
      }
    };
  };
}
