import { Modal as ANTModal, ModalProps } from 'antd';
import React from 'react';

interface Props extends ModalProps {
  children: React.ReactNode;
}

const {
  confirm,
  error,
  success,
  config,
  info,
  useModal,
  warning,
  warn,
  destroyAll,
} = ANTModal;

class Modal extends React.Component<Props> {
  static confirm = confirm;
  static error = error;
  static success = success;
  static config = config;
  static info = info;
  static useModal = useModal;
  static warning = warning;
  static warn = warn;
  static destroyAll = destroyAll;

  render() {
    const { children, ...rest } = this.props;
    return <ANTModal {...rest}>{this.props.children}</ANTModal>;
  }
}

export { Modal };
