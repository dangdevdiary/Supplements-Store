import { Coupon } from 'src/types/coupon';
import http from 'src/utils/http';

const couponApi = {
  getAllCoupon() {
    return http.get<Coupon[]>('/coupon/get_all');
  },
  applyCoupon(code: string, orderId: number) {
    return http.post<{
      message: string;
    }>('/coupon/apply', {
      code,
      order_id: orderId,
    });
  },
  clearCoupon(orderId: number) {
    return http.post<{
      message: string;
    }>('/coupon/clear', {
      order_id: orderId,
    });
  },
  createCoupon(number: number, value: number, type: string, startDate: string, endDate: string) {
    return http.post(`coupon/create`, {
      number,
      value,
      type,
      startDate,
      endDate,
      length: 8,
    });
  },
  deleteCoupon(id: number) {
    return http.delete(`coupon/delete/${id}`);
  },
};
export default couponApi;
