import { IUserModel } from "./User";

export interface IBlog {
  title: string,
  content: string,
  cover: string,
  author: IUserModel
}

export interface IBlogModel extends IBlog, Document { }