import { useEffect, useState } from 'react';
import DashboardLayout from '../layout/dashbaord';
import {
  IDocumentModel,
  IProviderRequest,
  IProviderRequestModel,
  ProviderRequestStatus,
  UserType,
} from '@enterslash/enterus/types';
import { useHttp } from '../hook/useHttp';
import {
  get_all_provider_requests,
  handle_provider_requests,
} from '@enterslash/enterus/http-client';
import { Button, Dropdown, Table, Text, Tag, Modal } from '@enterslash/react-ui';
import Private from '../components/Private';

interface Columns {
  id: string;
  username: string;
  status: string;
  document: IDocumentModel;
}

export function Index() {
  const [dataSource, setDataSource] = useState<Columns[]>([]);

  const { request: getRequests, loading: getRequestLoader } = useHttp<
    IProviderRequestModel[]
  >(() => {
    return get_all_provider_requests();
  });

  const { customRequest, loading: handleStatusLoader } = useHttp();

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Documents',
      dataIndex: 'document',
      key: 'document',
      render: (data: IProviderRequest['document']) => {
        return (
          <div>
            <img className="w-8 h-8 rounded-full" src={data.front} />
            <img className="w-8 h-8 rounded-full -ml-2" src={data.back} />
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (data: IProviderRequest['status']) => {
        if (data === ProviderRequestStatus.PENDING) {
          return <Tag color="orange">Pending</Tag>;
        } else if (data === ProviderRequestStatus.ACCEPTED) {
          return <Tag color="green">Active</Tag>;
        } else if (data === ProviderRequestStatus.REJECTED) {
          return <Tag color="red">Rejected</Tag>;
        } else {
          return <Tag>Unknown</Tag>;
        }
      },
    },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'x',
      render: (id: string, data: any) => {
        return (
          <div className="flex flex-row gap-2">
            <Button size="small" onClick={() => viewRequest(id)}>
              Check
            </Button>
            <Dropdown
              items={[
                ProviderRequestStatus.ACCEPTED,
                ProviderRequestStatus.REJECTED,
              ].map((status) => ({
                label: status,
                onClick: () => updateStatus(id, status),
              }))}
            >
              Status
            </Dropdown>
          </div>
        );
      },
    },
  ];

  const viewRequest = (id: string) => {
    const getSelectedData = dataSource.find((item) => item.id === id);
    Modal.info({
      title: 'Documents',
      icon: null,
      content: (
        <div className="w-full flex flex-col gap-5">
          <div>
            <Text className="mb-2">Front Side</Text>
            <img
              className="w-full h-[200px] object-cover rounded-lg"
              src={getSelectedData?.document.front}
            />
          </div>
          <div>
            <Text className="mb-2">Back Side</Text>
            <img
              className="w-full h-[200px] object-cover rounded-lg"
              src={getSelectedData?.document.back}
            />
          </div>
        </div>
      ),
    });
  };

  const updateStatus = (id: string, status: ProviderRequestStatus) => {
    customRequest(() =>
      handle_provider_requests(id, {
        status,
      })
    ).then(() => {
      setDataSource((prev) => {
        return prev.map((item) => {
          if (item.id === id) {
            item.status = status;
          }
          return item;
        });
      });
    });
  };

  useEffect(() => {
    getRequests().then((data) => {
      setDataSource(
        data.map((item) => ({
          id: item._id,
          username: item.provider.username,
          status: item.status,
          document: item.document,
        }))
      );
    });
  }, []);

  return (
    <DashboardLayout>
      <Table
        loading={getRequestLoader || handleStatusLoader}
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
