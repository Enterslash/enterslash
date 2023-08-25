import {
  CreateBlogDTO,
  GetBlogDTO,
  IBlogModel,
  IFileRequest,
  IRequest,
  Select,
} from '@enterslash/enterus/types';
import Blog from '../models/Blog';
import { failed, success } from '../utils/response';
import { uploadImage } from '../utils/file';
import { logger } from '../middleware/logger/logger';

export const createBlog = async (
  req: IFileRequest<CreateBlogDTO>,
  res,
  next
) => {
  try {
    const { content, title } = req.body;
    const cover = req.files?.cover;

    let coverUrl;

    try {
      const res = await uploadImage(cover);
      coverUrl = res.secure_url;
    } catch (error) {
      res.status(500).json(failed({ issue: error }));
    }

    const result = new Blog({
      title,
      content,
      cover: coverUrl,
    }).save();

    res.status(201).json(success({ data: result }));
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};

export const getAllBlog = async (req: IRequest, res, next) => {
  try {
    const { skip, limit } = req.query;

    const blogs = await Blog.aggregate([
      {
        $project: {
          _id: 1,
          item: 1,
          content: {
            $substr: ['$content', 0, 200],
          },
          author: 1,
          cover: 1,
          createdAt: 1,
          title: 1,
          // quarterSubtring: { $substr: ["$quarter", 2, -1] }
        } as Select<GetBlogDTO>,
      },
      { $skip: +skip || 0 }, // Skip items based on pagination
      { $limit: +limit || 20 },
    ]);
    res.status(201).json(success({ data: blogs }));
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};

export const getSingleBlog = async (
  req: IRequest<null, { id: string }>,
  res,
  next
) => {
  try {
    const id = req.params.id;
    console.log(id);
    const result = await Blog.findById(id);
    console.log(result);
    res.status(201).json(success({ data: result }));
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};

export const editBlog = async (
  req: IFileRequest<CreateBlogDTO, { id: string }>,
  res,
  next
) => {
  try {
    const { content, title, cover: coverOld } = req.body;
    const { id } = req.params;
    const cover = req.files?.cover;

    let coverUrl = coverOld as string;

    if (cover) {
      try {
        const res = await uploadImage(cover);
        coverUrl = res.secure_url;
      } catch (error) {
        res.status(500).json(failed({ issue: error }));
      }
    }

    await Blog.findOneAndUpdate(
      { _id: id },
      {
        title,
        content,
        cover: coverUrl,
      }
    );

    res.status(201).json(success({ message: 'Blog updated successfully' }));
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};

export const deleteBlog = async (
  req: IRequest<null, { id: string }>,
  res,
  next
) => {
  try {
    const { id } = req.params;
    await Blog.findByIdAndDelete({ _id: id });
    res.status(201).json(success({ message: 'Blog deleted successfully' }));
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};
