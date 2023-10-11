import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity("category")
export class Category {
  @PrimaryGeneratedColumn({
    name: "cateId",
  })
  cateId!: number;
  @Column()
  cateName!: string;
  @Column()
  cateDescription!: string;

  @OneToMany(() => Product, (product) => product.category)
  product!: Product[];
}
