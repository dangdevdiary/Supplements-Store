import http from 'src/utils/http';
import { ResGetAllUser, User, UserInfoWhenUpdate } from 'src/types/user.type';
import { ProductListConfig } from 'src/types/product.type';
import { TForgotPassword } from 'src/pages/forgotpassword/ForgotPassword';
const userApi = {
  getUserByid(id: number) {
    return http.get<User>(`/user/${id}`);
  },
  updateInfo(id: number, body: UserInfoWhenUpdate | { role: string }) {
    return http.put(`/user/${id}`, body);
  },
  addAddress(id: number, address: string) {
    return http.post<{
      id: string;
      address: string;
    }>(`user/${id}/add_address`, { address });
  },
  deleteAddress(idUser: number, idAddress: number) {
    return http.delete<{
      message: string;
    }>(`user/${idUser}/delete_address/${idAddress}`);
  },
  updateAddress(idUser: number, address: string, idAddress: number) {
    return http.put<{
      message: string;
    }>(`user/${idUser}/update_address/${idAddress}`, { address });
  },
  setDefaultAddress(idUser: number, idAddress: number) {
    return http.patch<{
      message: string;
    }>(`user/${idUser}/set_default_address`, { id_address: idAddress });
  },
  changePassword(old_password: string, new_password: string) {
    return http.patch<{
      message: string;
    }>('user/change_password', {
      old_password,
      new_password,
    });
  },
  getAllUser(params: ProductListConfig) {
    return http.get<ResGetAllUser>('user/get_all', {
      params,
    });
  },
  deleteUser(userId: number) {
    return http.delete(`user/${userId}`);
  },
  forgotPassword(email: string) {
    return http.post<{
      message: string;
      data: {
        tokenId: string;
      };
    }>('user/forgot-password', {
      email,
    });
  },
  resetPassword(data: Omit<TForgotPassword, 'confirmNewPassword' | 'otp'> & { otp: string }) {
    return http.post<{ message: string }>('user/reset-password', data);
  },
  updateAvatar(avatar: FormData, uid: number) {
    return http.post(`user/avatar/add/${uid}`, avatar, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
export default userApi;
