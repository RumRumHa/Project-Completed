import React, { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form } from 'react-bootstrap'
import { Card, Table as AntTable, Typography, Space, Popconfirm, Button } from 'antd'
import { toast } from 'react-toastify'
import useCartAddresses from './hooks/useCartAddresses';
import useCart from './hooks/useCart';
import CartAddressModal from './components/CartAddressModal';
import CartHeader from './components/CartHeader';
import CartSummary from './components/CartSummary';
import CartActions from './components/CartActions';
import { formatPrice } from '../../utils/formatPrice';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';

const { Text } = Typography

const CART_COLUMNS = (handleQuantityChange, handleRemoveItem) => [
  {
    title: 'Sản phẩm',
    dataIndex: 'productName',
    key: 'productName',
    render: (text, record) => (
      <Space>
        {record.mainImageUrl && record.mainImageUrl.length > 0 ? (
          <img
            src={record.mainImageUrl}
            alt={text}
            style={{ width: 80, height: 80, objectFit: 'cover' }}
          />
        ) : (
          <div 
            style={{ 
              width: 80, 
              height: 80, 
              background: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ShoppingCartOutlined style={{ fontSize: 24 }} className="text-muted" />
          </div>
        )}
        <Text>{text}</Text>
      </Space>
    ),
  },
  {
    title: 'Đơn giá',
    dataIndex: 'unitPrice',
    key: 'unitPrice',
    render: (price) => formatPrice(price),
    width: 150,
  },
  {
    title: 'Số lượng',
    dataIndex: 'orderQuantity',
    key: 'orderQuantity',
    width: 150,
    render: (quantity, record) => (
      <Form.Control
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => handleQuantityChange(record.shoppingCartId, parseInt(e.target.value))}
        style={{ width: '80px' }}
      />
    ),
  },
  {
    title: 'Thành tiền',
    key: 'total',
    render: (_, record) => formatPrice(record.unitPrice * record.orderQuantity),
    width: 150,
  },
  {
    title: 'Thao tác',
    key: 'action',
    width: 100,
    render: (_, record) => (
      <Popconfirm
        title="Xóa sản phẩm"
        description="Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?"
        onConfirm={() => handleRemoveItem(record.shoppingCartId)}
        okText="Xóa"
        cancelText="Hủy"
      >
        <Button
          variant="text"
          className="text-danger"
        >
          <DeleteOutlined />
        </Button>
      </Popconfirm>
    ),
  },
];

function Cart() {
  const navigate = useNavigate();
  // Sử dụng custom hook cho giỏ hàng
  const {
    items,
    loading,
    totalItems,
    totalAmount,
    checkoutLoading,
    addressModalVisible,
    setAddressModalVisible,
    fetchAllCart,
    updateCartTotals,
    handleQuantityChange,
    handleRemoveItem,
    handleClearCart,
    handleCheckout,
    handleConfirmCheckout
  } = useCart();
  // Sử dụng custom hook cho địa chỉ trong giỏ hàng
  const {
    addresses,
    loadingAddresses,
    selectedAddressId,
    setSelectedAddressId,
    fetchAllAddresses,
    handleSetDefaultAddress
  } = useCartAddresses();

  useEffect(() => {
    fetchAllAddresses();
    fetchAllCart();
  }, [fetchAllCart, fetchAllAddresses]);

  useEffect(() => {
    updateCartTotals();
  }, [updateCartTotals, items]);

  // Hàm mở modal chọn địa chỉ và fetch địa chỉ
  const handleOpenAddressModal = useCallback(() => {
    if (items.length === 0) {
      toast.error('Giỏ hàng trống, vui lòng thêm sản phẩm vào giỏ hàng');
      return;
    }
    setAddressModalVisible(true);
    fetchAllAddresses();
  }, [items.length, setAddressModalVisible, fetchAllAddresses]);
  
  const columns = CART_COLUMNS(handleQuantityChange, handleRemoveItem)

  return (
    <div style={{ padding: '24px' }}>
      <CartHeader 
        isEmpty={items.length === 0}
        onContinueShopping={() => navigate('/products')}
      />
      
      {items.length > 0 && (
        <Card>
          <AntTable
            columns={columns}
            dataSource={items}
            rowKey="shoppingCartId"
            loading={loading}
            pagination={false}
          />
          <CartSummary 
            totalItems={totalItems}
            totalAmount={totalAmount}
          />
          <CartActions
            onClearCart={handleClearCart}
            onCheckout={handleOpenAddressModal}
            disabled={items.length === 0 || checkoutLoading}
            loading={checkoutLoading}
          />
        </Card>
      )}

      <CartAddressModal
        visible={addressModalVisible}
        onCancel={() => setAddressModalVisible(false)}
        onConfirm={handleConfirmCheckout}
        loading={loading}
        addresses={addresses}
        loadingAddresses={loadingAddresses}
        selectedAddressId={selectedAddressId}
        onAddressSelect={setSelectedAddressId}
        onSetDefault={handleSetDefaultAddress}
        confirmLoading={checkoutLoading}
      />
    </div>
  )
}

export default Cart 