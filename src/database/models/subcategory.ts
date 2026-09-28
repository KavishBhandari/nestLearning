import mongoose from "mongoose";
import { subCategoryInterface } from "../Interface/subcategory";

export const SubCategorySchema = new mongoose.Schema<subCategoryInterface>({
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref:"Category", required: true },
    subCategoryName: { type: String, required: true },
    deleted_at: { type: Date }
});