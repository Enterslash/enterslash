import DashboardLayout from '../layout/dashbaord';
import {
  BookingStatus,
  BookingType,
  GetProviderBookingsDTO,
  IBooking,
  IBookingModel,
  IUserModel,
} from '@enterslash/enterus/types';
import { useEffect, useRef, useState } from 'react';
import { useHttp } from '../hook/useHttp';
import {
  assign_service,
  get_bookings,
  get_providers,
  update_booking_status,
} from '@enterslash/enterus/http-client';
import {
  Avatar,
  Button,
  Dropdown,
  Input,
  Modal,
  Table,
  Tag,
  List,
} from '@enterslash/react-ui';
import { formatDate, snackToNormalText, toNormalText } from '@enterslash/utils';
import { theme } from '@enterslash/enterus/utils';

interface Columns {
  id: string;
  service: string;
  user: string;
  status: string;
  location: string;
  type: IBooking['date'];
  date: string;
}

export function Index() {
  const [dataSource, setDataSource] = useState<Columns[]>([]);
  const bookData = useRef<{
    id: string;
    status: BookingStatus;
  }>({
    id: '',
    status: BookingStatus.PENDING,
  });
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedBooking, setSelectedBooking] = useState('');

  const columns = [
    {
      title: 'Service',
      dataIndex: 'service',
      key: 'service',
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Booking type',
      dataIndex: 'type',
      key: 'type',
      render: (date: IBookingModel['date']) => {
        if (date.mode === BookingType.ONE_TIME) {
          return <Tag color="blue">ONE TIME</Tag>;
        } else if (date.mode === BookingType.BI_WEEKLY) {
          return <Tag color="green">BI_WEEKLY</Tag>;
        } else if (date.mode === BookingType.WEEKLY) {
          return <Tag color="orange">WEEKLY</Tag>;
        } else if (date.mode === BookingType.MONTHLY) {
          return <Tag color="red">MONTHLY</Tag>;
        } else {
          return <Tag>Unknown</Tag>;
        }
      },
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (data: IBookingModel['status']) => {
        if (data === BookingStatus.PENDING) {
          return <Tag color="orange">Pending</Tag>;
        } else if (data === BookingStatus.ACCEPTED) {
          return <Tag color="blue">Active</Tag>;
        } else if (data === BookingStatus.REJECTED) {
          return <Tag color="red">Rejected</Tag>;
        } else if (data === BookingStatus.COMPLETED) {
          return <Tag color="green">Completed</Tag>;
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
          <div className="flex gap-2">
            <Button onClick={() => setSelectedBooking(id)} size="small">
              Assign
            </Button>
            <Dropdown
              items={[BookingStatus.ACCEPTED, BookingStatus.REJECTED]
                .filter((a) => a !== data.status)
                .map((status) => ({
                  label: toNormalText(status),
                  onClick: () => updateBookingStatus(id, status),
                }))}
            >
              Status
            </Dropdown>
          </div>
        );
      },
    },
  ];

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    bookData.current.id = id;
    bookData.current.status = status;
    requestStatusUpdate().then((res) => {
      if (res) {
        setDataSource((prev) => {
          return prev.map((item) => {
            if (item.id === id) {
              return {
                ...item,
                status: status,
              };
            }
            return item;
          });
        });
      }
    });
  };

  const { request: requestBooking, loading: loadingBooking } = useHttp<
    GetProviderBookingsDTO[]
  >(() => {
    return get_bookings();
  });

  const { request: requestAssign, loading: loadingAssign } = useHttp<string>(
    () => {
      return assign_service({
        bookingId: selectedBooking,
        providerId: selectedProvider,
      });
    }
  );

  const { request: requestStatusUpdate, loading: loadingStatusUpdate } =
    useHttp<GetProviderBookingsDTO>(() => {
      return update_booking_status(
        bookData.current.id,
        bookData.current.status
      );
    });

  const {
    data: providers,
    request: getProviders,
    loading: loadingProvider,
  } = useHttp<IUserModel[]>(() => {
    return get_providers();
  });

  useEffect(() => {
    getProviders();
    requestBooking().then((data) => {
      if (data) {
        setDataSource(
          data.map((item) => ({
            id: item._id,
            user: item.user.username,
            service: item.service.title,
            status: item.status,
            location: item.location.name,
            date: formatDate(item.date.start, 'dd-MM-yy hh:mm a'),
            type: item.date,
          }))
        );
      }
    });
  }, []);

  const isSelected = (id: string) => {
    return selectedProvider === id;
  };

  const confirmAssign = () => {
    setSelectedBooking('');
    setSelectedProvider('');
    requestAssign().then((res) => {
      if (res) {
        setDataSource((prev) => {
          return prev.filter((item) => item.id !== selectedBooking);
        });
      }
    });
  };

  return (
    <DashboardLayout>
      <Modal
        title="Assign provider"
        open={!!selectedBooking}
        onCancel={() => setSelectedBooking('')}
        onOk={confirmAssign}
      >
        <div className="flex flex-col gap-2 mt-2">
          <Input className="w-full" placeholder="Search provider" />
          <List
            style={{}}
            loading={loadingProvider}
            dataSource={providers || []}
            renderItem={(item) => (
              <List.Item
                style={{
                  backgroundColor: isSelected(item._id) ? theme.secondary : '',
                  cursor: 'pointer',
                  margin: '0 -24px',
                  padding: '10px 24px',
                }}
                onClick={() => {
                  setSelectedProvider(item._id);
                }}
                key={item._id}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.avatar} />}
                  title={item.username}
                  description={item.email}
                />
              </List.Item>
            )}
          />
        </div>
      </Modal>
      <Table
        loading={loadingBooking || loadingStatusUpdate || loadingAssign}
        className="overflow-auto"
        dataSource={dataSource}
        columns={columns}
      />
    </DashboardLayout>
  );
}

export default Index;
