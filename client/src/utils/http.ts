import axios, { AxiosError, type AxiosInstance } from 'axios';
import { ResponseApiLogin } from 'src/types/auth.type';
import { clearAccessToken, getAccessToken, getRefreshToken, saveAccessToken, saveRefreshToken } from './auth';
class Http {
  instance: AxiosInstance;
  token: string | null;
  constructor() {
    this.token = getAccessToken();
    this.instance = axios.create({
      baseURL: 'http://localhost:3000/api',
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
    });
    this.instance.interceptors.request.use((config) => {
      if (!this.token) this.token = getAccessToken();
      config.withCredentials = true;

      config.headers['Authorization'] = 'bearer ' + this.token;
      return config;
    });

    this.instance.interceptors.response.use(
      (res) => {
        if (res.config.url === '/auth') {
          this.token = (res.data as ResponseApiLogin)?.token || '';
          if (this.token) {
            saveAccessToken(this.token);
          }
        } else if (res.config.url === '/logout') {
          this.token = '';
          clearAccessToken();
        }
        return res;
      },
      async (err) => {
        if (err.response?.status === 401 && !err.config._retry) {
          err.config._retry = true;
          const res = await axios.post<{
            refreshToken: string;
            token: string;
          }>('http://localhost:3000/api/user/refresh-token', {
            refreshToken: getRefreshToken(),
          });

          if (res.data) {
            saveAccessToken(res.data.token);
            this.token = getAccessToken();
            saveRefreshToken(res.data.refreshToken);
            return this.instance(err.config);
          }
        }
        throw err;
      }
    );
  }
}
const http: AxiosInstance = new Http().instance;
export default http;
