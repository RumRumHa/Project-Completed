import React from 'react';
import { Modal, Radio, Button, Space, Card, Typography, Tag, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

const CartAddressModal = ({
  visible,
  onCancel,
  onConfirm,
  loading,
  addresses,
  loadingAddresses,
  selectedAddressId,
  onAddressSelect,
  onSetDefault,
  confirmLoading
}) => {
  const navigate = useNavigate();

  return (
    <Modal
      title="Chọn địa chỉ nhận hàng"
      open={visible}
      onOk={() => onConfirm(selectedAddressId)}
      onCancel={onCancel}
      okText="Xác nhận đặt hàng"
      cancelText="Hủy"
      confirmLoading={confirmLoading}
    >
      {loadingAddresses ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin />
        </div>
      ) : (
        <div>
          <Radio.Group 
            onChange={(e) => onAddressSelect(e.target.value)}
            value={selectedAddressId}
            style={{ width: '100%' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              {addresses.map(address => (
                <Card 
                  key={address.addressId} 
                  size="small" 
                  style={{ width: '100%', marginBottom: 8 }}
                >
                  <Radio value={address.addressId}>
                    <div>
                      <div style={{ marginBottom: 8 }}>
                        <Text strong>{address.receiveName}</Text>
                        <Text type="secondary"> | </Text>
                        <Text>{address.phone}</Text>
                        {address.isDefault && (
                          <Tag color="blue" style={{ marginLeft: 8 }}>Mặc định</Tag>
                        )}
                      </div>
                      <Text>{address.fullAddress}</Text>
                      {!address.isDefault && (
                        <Button 
                          type="link" 
                          size="small"
                          onClick={(e) => {
                            e.preventDefault();
                            onSetDefault(address.addressId);
                          }}
                        >
                          Đặt làm mặc định
                        </Button>
                      )}
                    </div>
                  </Radio>
                </Card>
              ))}
            </Space>
          </Radio.Group>
          <div style={{ marginTop: 16 }}>
            <Button 
              type="dashed" 
              icon={<PlusOutlined />} 
              block
              onClick={() => {
                onCancel();
                navigate('/profile/addresses');
              }}
            >
              Thêm địa chỉ mới
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default CartAddressModal;
