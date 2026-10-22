import { IsEmail, IsNotEmpty, isNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateAuthDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(5)
    password: string;

    @IsString()
    city: string;

    @IsString()
    address: string;

};

export class SignInDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    password: string;
};


