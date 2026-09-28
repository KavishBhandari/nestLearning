import { HttpException, HttpStatus } from "@nestjs/common";

import bcrypt from "bcrypt"
import multer from "multer";
import jwt, { SignOptions } from "jsonwebtoken";
import path from "path";
import { diskStorage, FileFilterCallback } from "multer";
import { Request } from "express";


import { tokenGenerationInterface } from "../database/Interface/tokenGenerationInterfce";
import { messages } from "../utils/constant";

class CommonHelper {
    hashPassword = async (password: string) => {
        const saltValue = await bcrypt.genSalt(10);
        return bcrypt.hash(password, saltValue);
    };

    comparePassword = async (bodyPassword: string, savedPasswoord: string) => {
        if (!(await bcrypt.compare(bodyPassword, savedPasswoord))) {
            throw new HttpException(messages.INVALID_CREDENTIALS, HttpStatus.BAD_REQUEST);
        }
        return;
    };

    generateAuthToken = async (data: tokenGenerationInterface, jwt_secret_key: string, expireTime: SignOptions['expiresIn'],) => {
        return jwt.sign(data, jwt_secret_key, {
            expiresIn: expireTime
        });
    };

    getPagination = (queryData: { page: string, limit: string }) => {
        const page = parseInt(queryData.page);
        const limit = queryData.limit ? parseInt(queryData.limit) : 10;

        //const limit = queryData.limit ? queryData.limit : 10;
        const offset =( page - 1) * limit || 0;
        return {
            limit, offset
        };
    };

    createPagination = (totalCount: number, page: number, limit: number) => {
        const currentPage = page > 0 ? page : 0;
        const totalPage = Math.ceil(totalCount / limit);
        const defaultPageValue = page || 1
        if (totalPage >= currentPage) {
            return {

                totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: defaultPageValue,
                nextPage: totalCount - limit * defaultPageValue > 0 ? defaultPageValue + 1 : 0,

            }
        }
    };

    imageUploadConfig = (uploadPath: string, fileSize: number) => ({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                //cb(null, path.join(__dirname, uploadPath));
                console.log("process.cwd()::::::::::::", process.cwd());
                const uploadDir = path.join(process.cwd(), uploadPath);

                cb(null, uploadDir);
            },

            filename: (req, file, cb) => {
                const ext = path.extname(file.originalname);
                const fileName = path.basename(file.originalname, ext);
                cb(null, `${fileName}-${Date.now()}${ext}`);
            },
        }),

        limits: {
            fileSize
        },

        fileFilter: (req: Request, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void,) => {
            const fileTypes = /jpeg|jpg|png|pdf/;
            const mimetype = fileTypes.test(file.mimetype);
            const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
            if (mimetype && extname) {
                return cb(null, true);
            } else {
                return cb(
                    new Error("Only images and PDF files are allowed!"),
                    false,
                );
            }
        },
    });

};

export default new CommonHelper();
