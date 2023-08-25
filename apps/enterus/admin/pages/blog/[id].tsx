import React from 'react';
import { GetBlogDTO } from '@enterslash/enterus/types';
import { MarkdownPreview } from '@enterslash/react-ui';
import DashboardLayout from '../../layout/dashbaord';
import axios from 'axios';
import { get_single_blog } from '@enterslash/enterus/http-client';

const DynamicBlog = ({ blog }: { blog: GetBlogDTO }) => {
  const { title, cover, _id, content } = blog;

  return (
    <DashboardLayout>
      <main>
        <div className="flex justify-between items-center">
          <section className="px-2">
            <h3 className="my-6 font-bold text-4xl text-center">{title}</h3>

            {/* <div className="mx-auto w-full sm:w-1/2">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 justify-center items-center">
            <img src={author.image} className="w-14 h-14 rounded-full" alt="" />
            <div>
              <p className="text-center sm:text-left">{author.name}</p>
              <p className="text-gray-500 text-center sm:text-left">
                {formatDate(post_date)}
              </p>
            </div>
          </div>
        </div> */}

            <img
              className="w-full h-auto md:h-96 my-3"
              src={cover}
              alt="photo"
              style={{objectFit: 'cover'}}
            />

            <MarkdownPreview content={content} />

            {/* <p className="text-gray-500 text-xl">{}</p> */}
            {/* <p className="text-center font-bold text-3xl my-12">Related Articles</p> */}
            {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2 ">
          {blogs.slice(0, 4).map((data) => (
            <BlogCard key={data.id} data={data} />
          ))}
        </div> */}
          </section>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default DynamicBlog;

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
