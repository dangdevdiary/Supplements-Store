import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
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

  @ManyToOne(() => Category, (category) => category.children)
  @JoinColumn({
    name: "parentCategoryId",
  })
  parent!: Category;

  @OneToMany(() => Category, (category) => category.parent, {
    onDelete: "CASCADE",
  })
  children!: Category[];
}
