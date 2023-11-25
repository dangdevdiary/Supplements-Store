export interface ISubCategory {
  cateId: number;
  cateName: string;
  cateDescription: string;
}

export interface ICategory {
  cateId: number;
  cateName: string;
  cateDescription: string;
  children: ISubCategory[];
  parent: ISubCategory;
}
export interface IManageCategory {
  cateId: number;
  cateName: string;
  cateDescription: string;
  // children: ISubCategory[];
  parent: string;
}
