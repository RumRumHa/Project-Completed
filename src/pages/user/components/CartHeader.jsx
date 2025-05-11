import React from 'react';
import { Button } from 'react-bootstrap';
import { Typography, Empty } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

const { Title } = Typography;

const CartHeader = ({ isEmpty, onContinueShopping }) => {
  if (isEmpty) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="Giỏ hàng trống"
      >
        <Button
          variant="primary"
          onClick={onContinueShopping}
        >
          <ShoppingCartOutlined className="me-2" />
          Tiếp tục mua sắm
        </Button>
      </Empty>
    );
  }

  return <Title level={2}>Giỏ hàng của bạn</Title>;
};

export default CartHeader;
