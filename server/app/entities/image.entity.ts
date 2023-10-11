import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./product.entity";
import { User } from "./user.entity";

export enum EnumTypeImage {
  avatar = "avatar", // avatar user
  thumbnail = "thumbnail", // thumbnail
  options = "options", // options of product,
  desc = "desc",
}

@Entity("images")
export class Image {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    type: "enum",
    enum: EnumTypeImage,
  })
  type!: EnumTypeImage;

  @Column()
  imageUrl!: string;

  @OneToOne(() => User, (user) => user.avatar, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "userId",
  })
  user!: User;

  @ManyToOne(() => Product, (product) => product.images, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "productId",
  })
  product!: Product;
}
