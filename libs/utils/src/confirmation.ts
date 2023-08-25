import { Modal } from 'antd';

const { confirm } = Modal;

interface Props {
  type: 'info' | 'success' | 'error' | 'warning';
  title: string;
  children: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

export const Confirmation = ({
  children,
  onConfirm,
  title,
  type,
  onCancel,
}: Props) => {
  // let icon: React.ReactNode;

  // if (type === "success") {
  //     icon = ExclamationCircleOutlined
  // } else if (type === "error") {
  //     icon = <ExclamationCircleOutlined />
  // } else if (type === "warning") {
  //     icon = <ExclamationCircleOutlined />
  // } else {
  //     icon = <ExclamationCircleOutlined />
  // }

  return confirm({
    // icon,
    content: children,
    onOk() {
      onConfirm();
    },
    onCancel() {
      onCancel();
    },
  });
};
