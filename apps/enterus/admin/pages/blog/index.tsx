import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layout/dashbaord';
import { Button, Modal, Space, Text } from '@enterslash/react-ui';
import { useRouter } from 'next/router';
import { BlogCard } from '@enterslash/enterus/components';
import { delete_blog, get_all_blog } from '@enterslash/enterus/http-client';
import { Confirmation } from '@enterslash/utils';
import { message } from 'antd';
import { GetBlogDTO } from '@enterslash/enterus/types';
import { useHttp } from '../../hook/useHttp';

const index = () => {
  const router = useRouter();

  const {
    data: blogs,
    setData,
    request,
    loading,
  } = useHttp<GetBlogDTO[]>(() => get_all_blog());

  useEffect(() => {
    request();
  }, []);

  const openCreator = () => {
    router.push('/blog/manage');
  };

  const [modal, setModal] = useState<boolean>(false);
  const cancelModal = () => {
    setModal(false);
  };

  const openDeleteModal = (id: string) => {
    Confirmation({
      type: 'warning',
      title: 'Delete Category',
      children: <Text>Are you sure you want to delete this Blog?</Text>,
      onConfirm: async () => {
        try {
          const res = await delete_blog(id);
          if (res) {
            setData(blogs?.filter((b) => b._id !== id) || null);
            message.success('Blog deleted successfully');
          }
        } catch (error) {
          console.log(error);
        }
      },
      onCancel: () => {
        message.info('Delete canceled');
      },
    });
  };

  return (
    <>
      <Modal open={modal} onCancel={cancelModal}>
        <Text size="sectionTitle">{'Delete Blog'}</Text>
        <Space height={10} />
      </Modal>
      <DashboardLayout>
        <main>
          <div className="flex my-7 justify-between items-center">
            <h2>Blog</h2>
            <div>
              <Button onClick={openCreator}>Add new blog</Button>
            </div>
          </div>
          <section>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {blogs?.map((data) => (
                <BlogCard
                  openDeleteModal={openDeleteModal}
                  key={data._id}
                  data={data}
                />
              ))}
            </div>
          </section>
        </main>
      </DashboardLayout>
    </>
  );
};

export default index;
