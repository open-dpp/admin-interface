import {defineStore} from 'pinia'
import {ref} from "vue";
import Product from "../types/Product.ts";
import axios from "../lib/axios.ts";

export const useProductsStore = defineStore('products', () => {
    const products = ref<Product[]>([]);

    const fetchProducts = async () => {
        const response = await axios.get('products');
        products.value = response.data;
    }

    return {products, fetchProducts}
});