import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import models from '../utils/modelName';
import mongoose, { Model } from 'mongoose';
import { RoleInterface } from '../database/Interface/roleInterface';
import { InjectModel } from '@nestjs/mongoose';
import { messages } from '../utils/constant';

@Injectable()
export class RoleService {
    constructor(
        @InjectModel(models.Role)
        private readonly roleModel: Model<RoleInterface>,
    ) { }

    async addRole(role: string) {
        await this.isRoleAlreadyExist(role);
        return await this.roleModel.create({
            roleName: role
        });
    };

    async isRoleAlreadyExist(role: string) {
        const getRole = await this.roleModel.findOne({
            roleName: role
        });
        if (getRole) {
            throw new HttpException(messages.ROLE_ALREADY_EXIST, HttpStatus.BAD_REQUEST);
        }
        return;
    }

    async updateRole(roleId: string, role: string) {
        return await this.roleModel.findByIdAndUpdate({
            _id: new mongoose.Types.ObjectId(roleId),
            deleted_at: null
        }, {
            roleName: role
        }, {
            new: true
        });
    };

    async getAllRole() {

    };

    async deleteRole(roleId: string) {
        return await this.roleModel.findByIdAndUpdate({
            _id: new mongoose.Types.ObjectId(roleId),
            deleted_at: null
        }, {
            deleted_at: new Date()
        }, {
            new: true
        });
    };
}
