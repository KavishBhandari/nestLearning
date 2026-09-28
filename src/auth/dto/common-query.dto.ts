import { IsOptional, IsString } from "class-validator";

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
};