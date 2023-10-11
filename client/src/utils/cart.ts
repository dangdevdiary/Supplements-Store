import jwtDecode from 'jwt-decode';
import { pick } from 'lodash';
import { CartItem } from 'src/types/cart';

let key: string;
const token = localStorage.getItem('token');
if (token) {
  const user = pick<{
    userId: string;
    lastName: string;
  }>(jwtDecode(token), ['userId', 'lastName']);
  key = user.lastName && user.userId ? user.lastName + user.userId : 'user';
}
export const saveCartItemToLocal = (value: CartItem[]) => {
  const saveValue = JSON.stringify(value);
  localStorage.setItem(key, saveValue);
};
export const getCartItemFromLocal = (): CartItem[] => {
  let keyOther = '';
  const token = localStorage.getItem('token');
  if (token) {
    const user = pick<{
      userId: string;
      lastName: string;
    }>(jwtDecode(token), ['userId', 'lastName']);
    keyOther = user.lastName && user.userId ? user.lastName + user.userId : 'user';
  }
  if (keyOther) {
    const result = localStorage.getItem(keyOther);
    if (result) return JSON.parse(result);
  }
  return [];
};
export const clearCartFromLocal = (key: string) => {
  localStorage.removeItem(key);
};
