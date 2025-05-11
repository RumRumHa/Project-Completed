import { Modal, Spin } from "antd";

const BaseModal = ({ loading = false, children, bodyStyle, styles = {}, ...rest }) => {
  const modalStyles = {
    ...styles,
    body: { ...bodyStyle, ...styles.body },
  };

  return (
    <Modal
      footer={null}
      centered
      destroyOnClose
      styles={modalStyles}
      {...rest}
    >
      <Spin spinning={loading}>{children}</Spin>
    </Modal>
  );
};

export default BaseModal;
