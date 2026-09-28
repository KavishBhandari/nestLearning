import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateAuthDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    city: string;

    @IsString()
    address: string;

};

export class SignInDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;
};


