import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./product.entity";

@Entity("specifications")
export class Specification {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  key!: string;

  @Column()
  value!: string;

  @ManyToOne(() => Product, (product) => product.specifications, {
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "productId",
  })
  product!: Product;
}
