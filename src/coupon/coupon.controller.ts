import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/createCouponDto';
import { messages } from '../utils/constant';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { loginUser } from '../decorator/loginUser';
import type { authPayloadInterface } from '../auth/strategies/jwt.strategy';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) { }



  /*getCoupon = async () => {

  };

  deleteCoupon = async () => {

  };

  updateCoupon = async () => {

  };*/

  @Post("craeteCoupon")
  @UseGuards(JwtAuthGuard)
  async craeteCoupon(@Body() body: CreateCouponDto, @loginUser() user: authPayloadInterface) {
    try {
      await this.couponService.isCouponAlreadyExist(body.code, body.title);

      const couponCreated = await this.couponService.craeteCoupon(body, user._id);
      return {
        statusCode: HttpStatus.CREATED,
        message: messages.COUPON_CREATED_SUCCESS,
        data: {
          couponCreated
        }
      };
    } catch (error) {

      if (error instanceof HttpException) {
        console.log("error ::::::::::::::", error.message);
        throw new HttpException(
          error.message,
          error.getStatus(),
        );
      }

      throw new HttpException(
        error instanceof Error
          ? error.message
          : 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

  };

  @Get("getCoupon/:id")
  async getCoupon(@Param("id") couponId: string) {
    const fethedCoupon = await this.couponService.getCoupon(couponId);
    return {
      statusCode: HttpStatus.CREATED,
      message: messages.COUPON_CREATED_SUCCESS,
      data: {
        fethedCoupon
      }
    };
  };

  @Get("getCouponByCode")
  async getCouponByCode(@Query() query : {couponCode? :  string}){
    const coupon = await this.couponService.getCouponByCode(query.couponCode);
    return {
      success : true,
      statusCode : HttpStatus.OK,
      message : messages.COUPON_FETCH_SUCCESS,
      data : {
        coupon
      }
    };
  };

};
