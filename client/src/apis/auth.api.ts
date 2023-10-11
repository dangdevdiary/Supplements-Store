import { RegisterResponse, ResponseApiLogin } from 'src/types/auth.type';
import http from 'src/utils/http';
const authApi = {
  registerAccount: (body: { email: string; password: string; firstName: string; lastName: string }) => {
    return http.post<RegisterResponse>('/user', body);
  },
  loginAccount: (body: { email: string; password: string }) => http.post<ResponseApiLogin>('/auth', body),
  loginSuccessGG: () => http.get<ResponseApiLogin>('/auth/google/success'),
  logout: (body: { refreshToken: string }) => http.post('/auth/logout', body),
};
export default authApi;
