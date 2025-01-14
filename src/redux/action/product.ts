import { createAsyncThunk } from "@reduxjs/toolkit";
import { productService } from "../../services";
import { RootState } from "../store";

export const getAllProducts = createAsyncThunk(
  'product/get-all',
  async (_, { getState }) => {
    const state = getState() as RootState;

    const { page, searchKeyWord, itemsPerPage, selectedCategory } = state.product
    
    const products = await productService.getAllProducts({page, searchKeyWord, itemsPerPage, selectedCategory})
    return products
  }
)

export const productAction = {
  getAllProducts
}