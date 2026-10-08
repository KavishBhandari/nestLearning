import mongoose from 'mongoose';
import { userInterface } from '../Interface/userInterface';
import models from '../../utils/modelName';

export const UserSchema = new mongoose.Schema<userInterface>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: models.Role,
        required: true
    },
    deleted_at : {
        type: Date,
        default : null
    }

}, {
    timestamps: { createdAt: true, updatedAt: true },
});