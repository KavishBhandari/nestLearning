import { IsBoolean, IsMongoId, IsString } from "class-validator";

export class ProductLikeDto  {
    @IsString()
    @IsMongoId()
    productId: string;

    @IsBoolean()
    isLike : boolean;
};