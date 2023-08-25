import DashboardLayout from '../../layout/dashbaord';
import {
  GetMultiServicesDTO,
  ICategoryModel,
  ServiceStatus,
  UserType,
} from '@enterslash/enterus/types';
import { useEffect, useState } from 'react';
import { useHttp } from '../../hook/useHttp';
import {
  get_all_services,
  get_services,
  update_service_status,
} from '@enterslash/enterus/http-client';
import { Button, Dropdown, Input, Space, Table, Tag } from '@enterslash/react-ui';
import { sliceText } from '@enterslash/utils';
import { useRouter } from 'next/router';
import Private from '../../components/Private';

interface Columns {
  id: string;
  title: string;
  description: string;
  cover: string;
  category: string[];
  action: string;
  status: ServiceStatus;
}

export function Index() {
  const [dataSource, setDataSource] = useState<Columns[]>([]);
  const [loader, setLoader] = useState(false);
  const router = useRouter();

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'category',
      dataIndex: 'category',
      key: 'category',
      render: (data: string[]) => {
        return (
          <div className="flex flex-wrap gap-2">
            {data.map((item, i) => {
              return (
                <Tag key={i} className="mr-0" color="cyan">
                  {item}
                </Tag>
              );
            })}
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'x',
      render: (status: any, data: any) => {
        return data.status === ServiceStatus.ACTIVE ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        );
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_: any, data: any) => (
        <div className="flex gap-2">
          <Button
            size="small"
            onClick={() => router.push(`/services/manage?id=${data.action}`)}
          >
            Edit
          </Button>
          <Dropdown
            items={[ServiceStatus.ACTIVE, ServiceStatus.INACTIVE].map(
              (status) => ({
                label: status,
                onClick: () => updateServiceStatus(data.id, status),
              })
            )}
          >
            Status
          </Dropdown>
        </div>
      ),
    },
  ];

  const { request, loading } = useHttp<GetMultiServicesDTO[]>(() => {
    return get_all_services();
  });

  const updateServiceStatus = async (id: string, status: ServiceStatus) => {
    try {
      setLoader(true);
      await update_service_status(id, {
        status,
      });
      setDataSource((prev) => {
        return prev.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              status,
            };
          }
          return item;
        });
      });
      setLoader(false);
    } catch (error) {
      setLoader(false);
    }
  };

  useEffect(() => {
    request().then((data) => {
      setDataSource(
        data.map((item) => ({
          id: item._id,
          title: item.title,
          description: sliceText(item.description, 50),
          cover: item.cover,
          category: item.category.map((item: ICategoryModel) => item.name),
          action: item._id,
          status: item.status,
        }))
      );
    });
  }, []);

  const openCreator = () => {
    router.push('/services/manage');
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center">
        <div>
          <Button onClick={openCreator}>Add new service</Button>
        </div>
        <Input placeholder="search service" />
      </div>
      <Space height={10} />
      <Table
        loading={loading}
        className="overflow-auto"
        dataSource={dataSource}
        columns={columns}
      />
    </DashboardLayout>
  );
}

const PrivatePage = () => {
  return (
    <Private access={[UserType.SUPER_ADMIN, UserType.ADMIN]}>
      <Index />
    </Private>
  );
};

export default PrivatePage;
