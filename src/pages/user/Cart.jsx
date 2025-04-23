import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Table, Button, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCartList, updateCartItem, removeCartItem, clearCart, checkout, updateTotals } from '../../redux/reducers/user/cartSlice'
import { Empty, Space, Popconfirm, Card, Typography, Table as AntTable, Modal, Radio, Spin, Tag } from 'antd'
import { DeleteOutlined, ShoppingCartOutlined, PlusOutlined } from '@ant-design/icons'
import { formatPrice } from '../../utils/formatPrice'
import { toast } from 'react-toastify'
import { fetchAddresses, setDefaultAddress } from '../../redux/reducers/user/accountSlice'

const { Title, Text } = Typography

function Cart() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { items, loading, totalItems, totalAmount } = useSelector((state) => state.cart)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [addressModalVisible, setAddressModalVisible] = useState(false)
  const { addresses, loading: loadingAddresses } = useSelector(state => state.account)
  const [selectedAddressId, setSelectedAddressId] = useState(null)

  useEffect(() => {
    dispatch(fetchCartList())
  }, [dispatch])

  useEffect(() => {
    dispatch(updateTotals())
  }, [dispatch, items])

  const fetchAddressesList = async () => {
    try {
      const data = await dispatch(fetchAddresses()).unwrap()
      const defaultAddress = data.find(addr => addr.isDefault)
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.addressId)
      } else if (data.length > 0) {
        setSelectedAddressId(data[0].addressId)
      }
    } catch (err) {
      console.error('Lỗi khi tải địa chỉ:', err)
      toast.error('Không thể tải danh sách địa chỉ')
    }
  }

  const handleSetDefaultAddress = async (addressId) => {
    try {
      await dispatch(setDefaultAddress(addressId)).unwrap()
      await fetchAddressesList()
      toast.success('Đã đặt làm địa chỉ mặc định')
    } catch (err) {
      console.error('Lỗi khi đặt địa chỉ mặc định:', err)
      toast.error('Không thể đặt địa chỉ mặc định')
    }
  }

  const handleQuantityChange = (cartItemId, quantity) => {
    if (quantity > 0) {
      dispatch(updateCartItem({ cartItemId, quantity }))
    }
  }

  const handleRemoveItem = (cartItemId) => {
    dispatch(removeCartItem(cartItemId))
  }

  const handleClearCart = () => {
    dispatch(clearCart())
  }

  const showAddressModal = () => {
    setAddressModalVisible(true)
    fetchAddressesList()
  }

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Giỏ hàng trống, vui lòng thêm sản phẩm vào giỏ hàng')
      return
    }
    showAddressModal()
  }

  const handleConfirmCheckout = async () => {
    if (!selectedAddressId) {
      toast.error('Vui lòng chọn địa chỉ nhận hàng')
      return
    }

    try {
      setCheckoutLoading(true)
      const response = await dispatch(checkout({ addressId: selectedAddressId })).unwrap()
      console.log('Kết quả thanh toán:', response)
      toast.success('Đặt hàng thành công!')
      setAddressModalVisible(false)
      navigate('/profile/orders')
    } catch (error) {
      console.error('Chi tiết lỗi thanh toán:', error)
      let errorMessage = 'Đặt hàng thất bại, vui lòng thử lại'
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error?.message) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      }
      toast.error(errorMessage)
    } finally {
      setCheckoutLoading(false)
    }
  }

  const columns = [
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
  ]

  if (items.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="Giỏ hàng trống"
      >
        <Button
          variant="primary"
          onClick={() => navigate('/products')}
        >
          <ShoppingCartOutlined className="me-2" />
          Tiếp tục mua sắm
        </Button>
      </Empty>
    )
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Giỏ hàng của bạn</Title>
      <Card>
        <AntTable
          columns={columns}
          dataSource={items}
          rowKey="shoppingCartId"
          loading={loading}
          pagination={false}
        />
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
        <div style={{
          marginTop: 24,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 16
        }}>
          <Popconfirm
            title="Xóa giỏ hàng"
            description="Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?"
            onConfirm={handleClearCart}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button variant="danger">Xóa giỏ hàng</Button>
          </Popconfirm>
          <Button 
            variant="primary" 
            onClick={handleCheckout}
            disabled={items.length === 0 || checkoutLoading}
          >
            {checkoutLoading ? 'Đang xử lý...' : 'Thanh toán'}
          </Button>
        </div>
      </Card>

      {/* Modal chọn địa chỉ */}
      <Modal
        title="Chọn địa chỉ nhận hàng"
        open={addressModalVisible}
        onOk={handleConfirmCheckout}
        onCancel={() => setAddressModalVisible(false)}
        okText="Xác nhận đặt hàng"
        cancelText="Hủy"
        confirmLoading={checkoutLoading}
      >
        {loadingAddresses ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin />
          </div>
        ) : (
          <div>
            <Radio.Group 
              onChange={(e) => setSelectedAddressId(e.target.value)}
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
                              e.preventDefault()
                              handleSetDefaultAddress(address.addressId)
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
                onClick={() => navigate('/profile/addresses')}
              >
                Thêm địa chỉ mới
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Cart 