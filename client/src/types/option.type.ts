export interface OptionProduct {
  flavor?: string;
  weight?: string;
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
