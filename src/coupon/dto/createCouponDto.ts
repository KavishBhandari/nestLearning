import { Type } from "class-transformer";
import { IsDate, IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { CouponType } from "../../database/Interface/couponInterface";

export class CreateCouponDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    code: string;

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    expiredAt: Date;

    @IsIn(CouponType)
    couponType : (typeof CouponType)[number];

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    disount:number

}
