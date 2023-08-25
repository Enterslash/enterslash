import { useEffect, useState } from 'react';
import DashboardLayout from '../layout/dashbaord';
import { GetCategoryDTO, ICategoryModel, UserType } from '@enterslash/enterus/types';
import { useHttp } from '../hook/useHttp';
import {
  create_category,
  delete_category,
  edit_category,
  get_categories,
} from '@enterslash/enterus/http-client';
import {
  Button,
  Dropdown,
  Input,
  Modal,
  Space,
  Table,
  Text,
} from '@enterslash/react-ui';
import { message } from '../utils/message';
import { Confirmation } from '@enterslash/utils';
import Private from '../components/Private';

interface Columns {
  id: string;
  name: string;
}

export function Index() {
  const [modal, setModal] = useState<boolean>(false);
  const [currentInput, setCurrentInput] = useState<{
    id: string;
    name: string;
  }>({
    id: '',
    name: '',
  });

  const [dataSource, setDataSource] = useState<Columns[]>([]);

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'x',
      render: (id: string, data: any) => {
        return (
          <Dropdown
            items={[
              {
                label: 'Edit',
                onClick: () => openEditModal(data),
              },
              {
                label: 'Delete',
                onClick: () => openDeleteModal(data.id),
              },
            ]}
          >
            Action
          </Dropdown>
        );
      },
    },
  ];

  const { request, loading } = useHttp<GetCategoryDTO[]>(() => {
    return get_categories();
  });

  const { request: createCategory, loading: createLoader } =
    useHttp<ICategoryModel>(() => {
      return create_category({
        name: currentInput.name,
      });
    });

  const { request: editCategory, loading: editLoader } =
    useHttp<ICategoryModel>(() => {
      return edit_category(currentInput.id, {
        name: currentInput.name,
      });
    });
  const { request: deleteCategory, loading: deleteLoader } =
    useHttp<ICategoryModel>(() => {
      return delete_category(currentInput.id);
    });
  useEffect(() => {
    request().then((data) => {
      setDataSource(
        data.map((item) => ({
          id: item._id,
          name: item.name,
        }))
      );
    });
  }, []);

  const openCreateModal = () => {
    setCurrentInput({
      id: '',
      name: '',
    });
    setModal(true);
  };

  const openEditModal = (data: ICategoryModel) => {
    setCurrentInput({
      id: data.id,
      name: data.name,
    });
    setModal(true);
  };

  const openDeleteModal = (id: string) => {
    setCurrentInput((prev) => ({ ...prev, id }));
    Confirmation({
      type: 'warning',
      title: 'Delete Category',
      children: <Text>Are you sure you want to delete this category?</Text>,
      onConfirm: () => {
        deleteCategory().then(() => {
          setDataSource((prev) => {
            const index = prev.findIndex((item) => item.id === id);
            prev.splice(index, 1);
            return [...prev];
          });
          message.success('Category deleted successfully');
        });
      },
      onCancel: () => {
        message.info('Delete canceled');
      },
    });
  };

  const cancelModal = () => {
    setModal(false);
  };

  const submitCategory = () => {
    createCategory().then((res) => {
      setDataSource((prev) => [
        {
          id: res._id,
          name: res.name,
        },
        ...prev,
      ]);
      message.success('Created new category successfully');
      setModal(false);
    });
  };

  const updateCategory = () => {
    editCategory().then((res) => {
      setDataSource((prev) => {
        const index = prev.findIndex((item) => item.id === res._id);
        prev[index] = {
          id: res._id,
          name: res.name,
        };
        return [...prev];
      });
      message.success('Category update successful');
      setModal(false);
    });
  };

  return (
    <>
      <Modal
        open={modal}
        onCancel={cancelModal}
        onOk={!currentInput.id ? submitCategory : updateCategory}
        confirmLoading={createLoader || editLoader}
      >
        <Text size="sectionTitle">
          {!currentInput.id ? 'Create new category' : 'Update category'}
        </Text>
        <Space height={10} />
        <Input
          name="name"
          value={currentInput.name}
          onChange={(e) =>
            setCurrentInput({ ...currentInput, name: e.target.value })
          }
        />
      </Modal>
      <DashboardLayout>
        <div className="flex justify-between items-center">
          <div>
            <Button onClick={openCreateModal}>Add new category</Button>
          </div>
          <Input placeholder="search category" />
        </div>
        <Space height={10} />
        <Table
          loading={loading || deleteLoader}
          className="overflow-auto"
          dataSource={dataSource}
          columns={columns}
        />
      </DashboardLayout>
    </>
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