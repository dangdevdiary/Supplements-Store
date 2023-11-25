import { ICategory } from 'src/types/category.type';
import http from 'src/utils/http';

// const timeout = (ms: number) => {
//   return new Promise((s) => setTimeout(s, ms));
// };

const baseURL = '/category';
const categoryApi = {
  async getAllCategory() {
    return http.get<{
      status: string;
      data: ICategory[];
    }>(`${baseURL}`);
  },
  async createCategory(body: { cateName: string; cateDescription: string }) {
    return http.post(`${baseURL}/sub-category/create`, body);
  },
  async delete(cateId: number) {
    return http.delete(`${baseURL}/delete/${cateId}`);
  },
  async update(body: { cateId: number; parentCateId: number; cateName: string; cateDescription: string }) {
    return http.put(`${baseURL}/update/${body.cateId}`, body);
  },
};
export default categoryApi;
