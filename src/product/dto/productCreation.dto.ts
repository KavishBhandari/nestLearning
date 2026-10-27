import { IsDateString, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class ProductCreationDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsDateString()
    @IsOptional()
    deleted_at?: Date | null;

    @IsMongoId()
    @IsNotEmpty()
    brand_id: string;

    @IsMongoId()
    @IsNotEmpty()
    category_id: string;

    @IsString()
    @IsNotEmpty()
    produtImage: string;
};