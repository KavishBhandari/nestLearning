import { IsMongoId, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { Type } from "class-transformer";

export class QueryDto {
    @IsOptional()
    @IsString()
    page: string

    @IsOptional()
    @IsString()
    limit: string

    @IsOptional()
    @IsString()
    search: string

    @IsOptional()
    @IsString()
    sortBy: string

    @IsOptional()
    @IsString()
    sortOrder: string

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    minPrice?: number

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    maxPrice?: number

    @IsOptional()
    @IsMongoId()
    category_id?: string

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(5)
    minRating?: number

    @IsOptional()
    @IsString()
    categoryName?: string
};