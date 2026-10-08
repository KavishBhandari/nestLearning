import { IsMongoId, IsNumber, IsOptional, Min, Max } from "class-validator";
import { Type } from "class-transformer";

export class ProductFilterDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    minPrice?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    maxPrice?: number;

    @IsOptional()
    @IsMongoId()
    category_id?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(5)
    minRating?: number;
}
