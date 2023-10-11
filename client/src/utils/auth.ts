export const saveAccessToken = (token: string) => {
  return localStorage.setItem('token', token);
};
export const saveRefreshToken = (token: string) => {
  return localStorage.setItem('refreshToken', token);
};
export const clearAccessToken = () => {
  return localStorage.removeItem('token');
};
export const clearRefreshToken = () => {
  return localStorage.removeItem('refreshToken');
};
export const getAccessToken = () => {
  return localStorage.getItem('token');
};
export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};
