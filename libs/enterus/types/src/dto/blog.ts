import { DTO } from '.';
import { IBlogModel, IUserModel } from '../models';

export type GetBlogDTO = DTO<IBlogModel, {
    _id: string,
    title: string;
    content: string,
    cover: string;
    author: IUserModel;
    createdAt: Date;
  }
>;

export type CreateBlogDTO = {
  title: string;
  content: string;
  cover: File | string;
}
