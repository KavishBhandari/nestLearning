import mongoose from "mongoose";
import { RoleInterface } from "../Interface/roleInterface";

export const RoleSchema = new mongoose.Schema<RoleInterface>({
    roleName: {
        type: String,
        required: true
    },
    deleted_at: {
        type: Date,
    }
}, {
    timestamps: {
        createdAt: true,
        updatedAt: true
    },
    collection: "role"
});