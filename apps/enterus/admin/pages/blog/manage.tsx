import { Button, Input, TextEditor } from '@enterslash/react-ui';
import DashboardLayout from '../../layout/dashbaord';
import { useEffect, useState } from 'react';
import { CreateBlogDTO, GetBlogDTO } from '@enterslash/enterus/types';
import {
  create_blog,
  edit_blog,
  get_single_blog,
} from '@enterslash/enterus/http-client';
import { useRouter } from 'next/router';
import { useHttp } from '../../hook/useHttp';
import { message } from '../../utils/message';
import axios from 'axios';

const createBlog = ({ blog }: { blog: GetBlogDTO }) => {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState<CreateBlogDTO>({
    content: '',
    cover: '',
    title: '',
  });

  const { loading, customRequest: request } = useHttp();

  useEffect(() => {
    if (blog) {
      setForm(blog);
    }
  }, [blog]);

  const [coverUrl, setCoverUrl] = useState<string | ArrayBuffer | null>(null);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setForm((prevData) => ({ ...prevData, cover: file as unknown as string }));

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const create = () => {
    try {
      request(() => create_blog(form)).then(() => {
        message.success('Blog has been created successfully!');
      });
    } catch (error) {
      console.log(error);
    }
  };

  const update = () => {
    try {
      request(() => edit_blog(id as string, form)).then(() => {
        message.success('Blog has been updated successfully!');
      })
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <DashboardLayout>
        <div className="w-full mx-auto p-4 flex flex-col gap-4">
          {/* Upload Cover */}
          <label htmlFor="cover">
            <div className="h-[200px] rounded-lg bg-gray-200 overflow-hidden">
              {coverUrl || form.cover ? (
                <img
                  src={(coverUrl || form.cover) as string}
                  alt="Cover Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-neutral-400">Upload Cover</p>
                </div>
              )}
            </div>
          </label>

          {/* Title Input */}
          <div>
            <Input
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
              value={form.title}
              placeholder="Title"
            />
          </div>

          {/* Text Editor */}
          <TextEditor
            onChange={(e: string) =>
              setForm((prev) => ({ ...prev, content: e }))
            }
            value={form.content}
          />

          <div className="text-center mt-3">
            {id ? (
              <Button loading={loading} onClick={() => update()}>Update Blog</Button>
            ) : (
              <Button loading={loading} onClick={() => create()}>Create Blog</Button>
            )}
          </div>
        </div>
      </DashboardLayout>
      <input
        type="file"
        accept="image/*"
        id="cover"
        name="cover"
        onChange={handleCoverChange}
        className="sr-only"
      />
    </>
  );
};
export default createBlog;

export async function getServerSideProps(context: any) {
  const { query } = context;
  const blogId = query.id;
  if (blogId) {
    const res = await get_single_blog(blogId);
    return {
      props: {
        blog: res,
      },
    };
  } else {
    return {
      props: {
        blog: null,
      },
    };
  }
}
