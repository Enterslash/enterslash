import React from 'react';
import Link from 'next/link';
import { DeleteTwoTone, EditTwoTone } from '@ant-design/icons';
import { Card } from '@enterslash/react-ui';
import { useRouter } from 'next/router';
import { GetBlogDTO } from '@enterslash/enterus/types';
import { formatDate } from '@enterslash/utils';

export interface BlogCardProps {
  data: GetBlogDTO;
  openDeleteModal?: (id: string) => void;
  noActions?: boolean;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  data,
  openDeleteModal,
  noActions,
}) => {
  const handleDelete = (id: string) => {
    openDeleteModal && openDeleteModal(id);
  };

  const router = useRouter();

  const openCreator = () => {
    router.push(`/blog/manage?id=${data._id}`);
  };

  return (
    <Card className="rounded-lg flex flex-col overflow-hidden">
      <Link href={`blog/${data._id}`}>
        <img
          width="100%"
          height={200}
          src={data.cover}
          alt="photo"
          style={{
            objectFit: 'cover',
          }}
        />
      </Link>
      <div
        style={{ padding: '20px' }}
        className="flex flex-col justify-between gap-4"
      >
        <div className="flex flex-col gap-4">
          <h3 className="text-xl">{data.title}</h3>
          <p>{data.content.slice(0, 200) + '...'}</p>
        </div>
        <div className="flex mt-10 items-center justify-between">
          <p className="opacity-50 italic text-sm">
            {formatDate(data.createdAt)}
          </p>
          {!noActions && (
            <div className="flex gap-5">
              <EditTwoTone onClick={openCreator} style={{ fontSize: '20px' }} />
              <DeleteTwoTone
                onClick={() => handleDelete(data._id)}
                style={{ fontSize: '20px', color: 'red' }}
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
