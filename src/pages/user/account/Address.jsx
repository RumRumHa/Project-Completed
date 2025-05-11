import React from 'react';
import { Button, List, Modal, Form, Input, Checkbox, Popconfirm, Empty, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const Address = ({
  addresses,
  loading,
  selectedAddress,
  isAddressModalVisible,
  isAddressDetailVisible,
  editingAddress,
  addressForm,
  showAddressModal,
  showEditAddressModal,
  handleAddressModalCancel,
  handleAddressSubmit,
  handleDeleteAddress,
  showAddressDetail
}) => (
  <>
    <div style={{ marginBottom: 16 }}>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={showAddressModal}
      >
        Thêm Địa Chỉ Mới
      </Button>
    </div>

    <List
      itemLayout="horizontal"
      dataSource={addresses}
      loading={loading}
      locale={{
        emptyText: (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Bạn chưa có địa chỉ nào"
          >
            <Button type="primary" icon={<PlusOutlined />} onClick={showAddressModal}>
              Thêm Địa Chỉ Mới
            </Button>
          </Empty>
        )
      }}
      renderItem={item => (
        <List.Item
          actions={[
            <Button type="link" onClick={() => showAddressDetail(item.addressId)}>
              Chi tiết
            </Button>,
            <Button type="link" onClick={() => showEditAddressModal(item)}>
              Sửa
            </Button>,
            <Popconfirm
              title="Bạn có chắc muốn xóa địa chỉ này?"
              onConfirm={() => handleDeleteAddress(item.addressId)}
              okText="Có"
              cancelText="Không"
            >
              <Button danger>Xóa</Button>
            </Popconfirm>
          ]}
        >
          <List.Item.Meta
            title={
              <>
                {item.receiveName}
                {item.isDefault && (
                  <Tag color="success" style={{ marginLeft: 8 }}>
                    Mặc định
                  </Tag>
                )}
              </>
            }
            description={
              <div>
                <div>{item.fullAddress}</div>
                <div>Điện thoại: {item.phone}</div>
              </div>
            }
          />
        </List.Item>
      )}
    />

    <Modal
      title="Chi tiết địa chỉ"
      open={isAddressDetailVisible}
      onCancel={handleAddressModalCancel}
      footer={[
        <Button key="close" onClick={handleAddressModalCancel}>
          Đóng
        </Button>,
        <Button
          key="edit"
          type="primary"
          onClick={() => {
            handleAddressModalCancel();
            showEditAddressModal(selectedAddress);
          }}
        >
          Chỉnh sửa
        </Button>
      ]}
    >
      {selectedAddress && (
        <div>
          <p><strong>Người nhận:</strong> {selectedAddress.receiveName}</p>
          <p><strong>Số điện thoại:</strong> {selectedAddress.phone}</p>
          <p><strong>Địa chỉ đầy đủ:</strong> {selectedAddress.fullAddress}</p>
          <p><strong>Mặc định:</strong> {selectedAddress.isDefault ? <Tag color="success">Địa chỉ mặc định</Tag> : 'Không'}</p>
        </div>
      )}
    </Modal>

    <Modal
      title={editingAddress ? "Sửa Địa Chỉ" : "Thêm Địa Chỉ Mới"}
      open={isAddressModalVisible}
      onCancel={handleAddressModalCancel}
      footer={null}
    >
      <Form
        form={addressForm}
        layout="vertical"
        onFinish={handleAddressSubmit}
      >
        <Form.Item
          name="receiveName"
          label="Tên người nhận"
          rules={[{ required: true, message: 'Vui lòng nhập tên người nhận!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[
            { required: true, message: 'Vui lòng nhập số điện thoại!' },
            { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="fullAddress"
          label="Địa chỉ đầy đủ"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          name="isDefault"
          valuePropName="checked"
        >
          <Checkbox
            disabled={editingAddress && editingAddress.isDefault && addresses.filter(a => a.isDefault).length === 1}
          >
            Đặt làm địa chỉ mặc định
          </Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {editingAddress ? 'Cập Nhật' : 'Thêm Địa Chỉ'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  </>
);

export default Address;
