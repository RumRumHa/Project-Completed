import React from 'react';
import { Space, Typography } from 'antd';
import { formatPrice } from '../../../utils/formatPrice';

const { Text } = Typography;

const CartSummary = ({ totalItems, totalAmount }) => {
  return (
    <div style={{ 
      marginTop: 24,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <Space>
        <Text>Tổng số lượng: </Text>
        <Text strong>{totalItems} sản phẩm</Text>
      </Space>
      <Space>
        <Text>Tổng tiền: </Text>
        <Text strong style={{ fontSize: 20, color: '#f5222d' }}>
          {formatPrice(totalAmount)}
        </Text>
      </Space>
    </div>
  );
};

export default CartSummary;
