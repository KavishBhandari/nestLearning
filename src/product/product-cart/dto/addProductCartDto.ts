import { IsInt, IsMongoId, IsNotEmpty, IsOptional, Max, Min } from "class-validator";

export class AddToCartProductDto {

    @IsMongoId()
    @IsNotEmpty()
    productID: string

   // @IsOptional()
    @IsInt()
    @Min(1)
    @Max(10)
    quantity: number
};

