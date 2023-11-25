import { ISuggestProduct, Product, ProductListConfig, ProductsList } from 'src/types/product.type';
import http from 'src/utils/http';
const URL = '/product/';
const timeout = (ms: number) => {
  return new Promise((s) => setTimeout(s, ms));
};

const productsApi = {
  async getProductsList(params: ProductListConfig) {
    await timeout(500);
    return http.get<ProductsList>(`${URL}/get_all`, {
      params,
    });
  },
  async getProductDetail(id: string) {
    await timeout(500);
    return http.get<Product>(`${URL}/${id}`);
  },
  async canRate(id: number) {
    await timeout(500);
    return http.get<{
      is_done: boolean;
      can_rate: boolean;
    }>(`${URL}can_rate/${id}`);
  },
  async createProduct(data: any) {
    return await http.post('/product', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  async deleteProduct(productId: number) {
    return http.delete(`/product/${productId}`);
  },
  async updateProduct(
    productId: number,
    data: {
      name: string;
      description: string;
      brandId: number;
    }
  ) {
    return http.put(`product/${productId}`, data);
  },
  async createOption(productId: number, data: any) {
    return await http.post(`product_option/${productId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  async deleteOption(option_id: number) {
    return await http.delete(`product_option/${option_id}`);
  },
  async updateOption(
    product_option_id: number,
    data: {
      flavor?: string;
      weight?: string;
      price?: string;
    }
  ) {
    return http.put(`product_option/${product_option_id}`, data);
  },
  async createSpec(productId: number, key: string, value: string) {
    return await http.post(`specification/${productId}`, [{ key, value }]);
  },
  async deleteSpec(spec_id: number) {
    return await http.delete(`specification/${spec_id}`);
  },
  async updateOneSpec(spec_id: number, value: string) {
    return await http.put(`specification/${spec_id}`, { value });
  },
  async trackingProduct(productId: number) {
    return await http.get(`analysis/tracking_product/${productId}`);
  },
  async suggestProducts(sugestion: {
    weight: number;
    height: number;
    waist: number;
    neck: number;
    hip?: number;
    gender: string;
  }) {
    return await http.post<{
      status: string;
      data: Product[];
    }>('product/suggest', sugestion);
  },
};

export default productsApi;
