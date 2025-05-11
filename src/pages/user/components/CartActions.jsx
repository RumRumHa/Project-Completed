import React from 'react';
import { Button } from 'react-bootstrap';
import { Popconfirm } from 'antd';

const CartActions = ({ 
  onClearCart, 
  onCheckout, 
  disabled,
  loading 
}) => {
  return (
    <div style={{
      marginTop: 24,
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 16
    }}>
      <Popconfirm
        title="Xóa giỏ hàng"
        description="Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?"
        onConfirm={onClearCart}
        okText="Xóa"
        cancelText="Hủy"
      >
        <Button variant="danger">Xóa giỏ hàng</Button>
      </Popconfirm>
      <Button 
        variant="primary" 
        onClick={onCheckout}
        disabled={disabled}
      >
        {loading ? 'Đang xử lý...' : 'Thanh toán'}
      </Button>
    </div>
  );
};

export default CartActions;
