import mongoose from "mongoose";

export interface subCategoryInterface {
    categoryId : mongoose.Types.ObjectId,
    subCategoryName : string
    deleted_at : Date
};