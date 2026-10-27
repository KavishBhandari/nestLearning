import mongoose from "mongoose";

export interface ProductInterface {
  name : string;
  title: string;
  description: string;
  price: number;
  brand_id: mongoose.Types.ObjectId;
  category_id: mongoose.Types.ObjectId;
  stock:number;
  deleted_at?: Date | null;
}