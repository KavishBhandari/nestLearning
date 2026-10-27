import { IsMongoId, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ProductReviewDto {
    @IsString()
    @IsNotEmpty()
    comment: string

    @IsNumber()
    @IsNotEmpty()
    rating: number

    @IsMongoId()
    @IsNotEmpty()
    productId:string
};