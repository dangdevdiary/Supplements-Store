import { ILike } from "typeorm";
import { AppDataSource } from "../database";
import { Brand } from "../entities/brand.entity";
import { catchError } from "../utils/error";
import createHttpError from "http-errors";

const brandRepository = AppDataSource.getRepository(Brand);

export interface BrandInterface {
  name: string;
  description: string;
}

export const create = async (data: BrandInterface) => {
  try {
    const { name, description } = data;
    const nameExists = await brandRepository.findOneBy({ name });
    if (nameExists) return createHttpError.BadRequest("name already exists");
    if (!name || !description)
      return createHttpError.BadRequest("please fill all information");
    const newBrand = brandRepository.create({ name, description });
    return await brandRepository.save(newBrand);
  } catch (error) {
    return catchError(error, "something went wrong when create new brand");
  }
};

export const updateOne = async (id: number, data: BrandInterface) => {
  try {
    const brand = await brandRepository.findOneBy({ id });
    if (!brand) return createHttpError.BadRequest("brand not found");
    return await brandRepository.update({ id }, { ...data });
  } catch (error) {
    return catchError(error, "something went wrong when update brand");
  }
};

export const deleteOne = async (id: number) => {
  try {
    const result = await brandRepository.delete({ id });
    return result.affected
      ? { message: "delete success", status: "success" }
      : createHttpError.InternalServerError("delete failed");
  } catch (error) {
    return catchError(error, "something went wrong when delete brand");
  }
};

export const getAll = async (search: string | undefined = undefined) => {
  try {
    return await brandRepository.find({
      where: {
        name:
          search !== undefined && search !== "" && search !== null
            ? ILike(`%${search}%`)
            : undefined,
      },
    });
  } catch (error) {
    return catchError(error, "something went wrong when get all brand");
  }
};
