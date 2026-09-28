import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { userInterface } from '../../database/Interface/userInterface';
import { Model } from 'mongoose';

/*
payload ::::::::::: {
  _id: '6ab22d8a14e0f9e5d192e0da',
  email: 'abc@yopmail.com',
  iat: 1790165462,
  exp: 1790251862
}*/

export interface authPayloadInterface {
    _id: string,
    email: string,
    roleId?:string,
    iat: number,
    exp: number
};


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectModel("User")
        private readonly userModel : Model<userInterface>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET_KEY!,
        });//here passport internally use jwt.verify
    }

    async validate(payload: authPayloadInterface) {
        ///console.log("payload :::::::::::", payload);
        const user = await this.userModel.findOne({
            _id:payload._id
        }).select("_id name email roleId").populate("roleId")
        // return payload;

        console.log(" user found from auth::::::::::", user)
        if(!user){
            throw new UnauthorizedException('Unauthenticate User');
        }
        return user;
    }
}