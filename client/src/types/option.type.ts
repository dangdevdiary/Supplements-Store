export interface OptionProduct {
  flavor?: string;
  weigth?: string;
  price?: string;
  product_option_id?: number;
  quantity?: number;
  image?: {
    id: string;
    imageUrl: string;
    type: string;
  };
  index?: number;
}
