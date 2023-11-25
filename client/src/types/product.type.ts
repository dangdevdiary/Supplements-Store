import { User } from './user.type';

export interface Product {
  id: number;
  name: string;
  description: string;
  createAt: string;
  productionDate: string;
  expirationDate: string;
  updateAt: string;
  brand: string;
  brand_description: string;
  brandId?: number;
  category: string;
  rate: number;
  feedback: {
    id: number;
    rate: number;
    comment: string;
    create_at: string;
    user?: {
      id: number;
      email: string;
      firstName: string;
      lastName: string;
    };
  }[];
  specs: {
    id: number;
    key: string;
    value: string;
  }[];
  images: {
    id: string;
    type: string;
    imageUrl: string;
  };
  productOptions: {
    product_option_id?: number;
    flavor?: string;
    weight?: string;
    price?: string;
    quantity?: number;
    image?: {
      id: string;
      imageUrl: string;
      type: string;
    };
  }[];
}
export interface ProductsList {
  current_page: number;
  prev_page: number | null;
  next_page: number | null;
  last_page: number;
  data_per_page: number;
  total: number;
  data: Omit<Product, 'brand_description' | 'createAt' | 'updateAt' | 'specs'>[];
}

export interface ProductListConfig {
  limit?: string;
  page?: string;
  brandId?: string;
  price_min?: string;
  price_max?: string;
  rate?: string;
  search?: string;
  query?: string;
}
export type Feedback = {
  productId: number;
  userId: number;
  rate: number;
  comment: string;
};
export type ResFeedback = {
  rate: number;
  comment: string;
  product: {
    id: 1;
    name: string;
    createAt: string;
    updateAt: string;
    rate: string;
  };
  user: User;
  id: number;
  create_at: string;
};
export type ResGetFeedback = {
  rate: number;
  data: {
    id: number;
    rate: number;
    comment: string;
    create_at: string;
    user: User;
  }[];
};

export type ProductData = {
  name: string;
  image?: File;
  description: string;
  flavor: string;
  weight: string;
  price: string;
  brandId: number;
  color: string;
};
export type ResAnalysGetProducts = {
  current_page: number;
  prev_page: number | null;
  next_page: number | null;
  last_page: number;
  data_per_page: number;
  total: number;
  data: {
    product_option_id: number;
    quantity: number;
    images: string;
    name: string;
    flavor: string;
    weight: string;
  }[];
};

export interface ISuggestProduct {
  id: number;
  name: string;
  expirationDate: string;
  productionDate: string;
  images: {
    id: string;
    type: string;
    imageUrl: string;
  };
  // category: Category;
  rate: string;
}
