import { GetBlogDTO, CreateBlogDTO } from '@enterslash/enterus/types';
import $api from './client';
import { toFormData } from '@enterslash/utils';

export const get_all_blog = (limit?: number): Promise<GetBlogDTO[]> => {
  return $api.get('/blog', { params: { limit } });
};

export const get_single_blog = (id: string): Promise<GetBlogDTO> => {
  return $api.get(`/blog/${id}`);
};

export const create_blog = (data: CreateBlogDTO): Promise<GetBlogDTO> => {
  const formData = toFormData<CreateBlogDTO>(data, ['cover']);
  return $api.post('/blog', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const edit_blog = (
  id: string,
  data: CreateBlogDTO
): Promise<GetBlogDTO> => {
  const formData = toFormData<CreateBlogDTO>(data, ['cover']);
  return $api.put(`/blog/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const delete_blog = (id: string): Promise<GetBlogDTO> => {
  return $api.delete(`/blog/${id}`);
};
