import { IBlogModel } from '@enterslash/enterus/types';
import { Schema, model } from 'mongoose';

const blogSchema = new Schema<IBlogModel>(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      require: true,
    },
    cover: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Blog = model('Blog', blogSchema);

export default Blog;
