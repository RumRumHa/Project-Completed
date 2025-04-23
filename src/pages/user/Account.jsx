import React, { useEffect, useState } from 'react';
import { Tabs, Card, Avatar, Form, Input, Button, Upload, Radio, List, Popconfirm, Row, Col, Empty, Modal, Tag, Divider, Space, Select, Tooltip, Table, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, HomeOutlined, HeartOutlined, HistoryOutlined, UploadOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  fetchAccountInfo,
  updateAccountInfo,
  fetchAddresses,
  deleteAddress,
  fetchWishlist,
  removeFromWishlist,
  fetchOrderHistory,
  cancelOrder,
  addAddress,
  updateAddress,
  fetchOrdersByStatus,
  fetchOrderDetail,
  fetchAddressById
} from '../../redux/reducers/user/accountSlice';
import { changePassword } from '../../redux/reducers/public/authSlice';
import { Link } from 'react-router-dom';
import { OrderStatus, OrderStatusLabels, OrderStatusColors } from '../../enums/OrderStatus';
import { setDefaultAddress } from '../../redux/reducers/user/accountSlice';
const { TabPane } = Tabs;

const Account = ({ defaultTab = 'profile' }) => {
  const dispatch = useDispatch();
  const { accountInfo, addresses, wishlist, orders, loading, selectedAddress } = useSelector(state => state.account);
  const [form] = Form.useForm();
  const [orderDetail, setOrderDetail] = useState(null);
  const [passwordForm] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm] = Form.useForm();
  const [isOrderDetailVisible, setIsOrderDetailVisible] = useState(false);
  const [isAddressDetailVisible, setIsAddressDetailVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchAccountInfo());
    dispatch(fetchAddresses());
    dispatch(fetchWishlist());
    dispatch(fetchOrderHistory());
  }, [dispatch]);

  useEffect(() => {
    if (accountInfo) {
      form.setFieldsValue({
        username: accountInfo.username,
        fullname: accountInfo.fullname,
        email: accountInfo.email,
        phone: accountInfo.phone,
        address: accountInfo.address
      });
      setAvatarUrl(accountInfo.avatar);
    }
  }, [accountInfo, form]);

  const handleUpdateProfile = async (values) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        if (values[key] !== undefined && key !== 'avatar') {
          formData.append(key, values[key]);
        }
      });
      
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }
      
      await dispatch(updateAccountInfo(formData)).unwrap();
      toast.success('Cập nhật thông tin thành công');
      setAvatarFile(null); 
    } catch {
      toast.error('Cập nhật thông tin thất bại');
    }
  };

  const handleChangePassword = async (values) => {
    try {
      const { confirmNewPass, ...passwordData } = values;
      await dispatch(changePassword({
        ...passwordData,
        confirmNewPass: confirmNewPass
      })).unwrap();
      
      toast.success('Đổi mật khẩu thành công');
      passwordForm.resetFields();
    } catch (error) {
      toast.error(error || 'Đổi mật khẩu thất bại');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await dispatch(deleteAddress(addressId)).unwrap();
      toast.success('Xóa địa chỉ thành công');
    } catch {
      toast.error('Xóa địa chỉ thất bại');
    }
  };

  const handleRemoveFromWishlist = async (wishListId) => {
    try {
      await dispatch(removeFromWishlist(wishListId)).unwrap();
      toast.success('Đã xóa khỏi danh sách yêu thích');
    } catch {
      toast.error('Không thể xóa khỏi danh sách yêu thích');
    }
  };

  const handleAvatarChange = (info) => {
    if (info.file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarUrl(e.target.result);
      };
      reader.readAsDataURL(info.file);
      
      setAvatarFile(info.file);
    }
  };

  const showAddressModal = () => {
    setEditingAddress(null);
    addressForm.resetFields();
    setIsAddressModalVisible(true);
  };

  const showEditAddressModal = (address) => {
    setEditingAddress(address);
    addressForm.setFieldsValue({
      receiveName: address.receiveName,
      phone: address.phone,
      fullAddress: address.fullAddress,
      isDefault: address.isDefault
    });
    setIsAddressModalVisible(true);
  };

  const handleAddressModalCancel = () => {
    setIsAddressModalVisible(false);
    setEditingAddress(null);
    addressForm.resetFields();
  };

  const handleAddressSubmit = async (values) => {
    try {
      let addressId;
      if (editingAddress) {
        await dispatch(updateAddress({ addressId: editingAddress.addressId, ...values })).unwrap();
        addressId = editingAddress.addressId;
        toast.success('Cập nhật địa chỉ thành công');
      } else {
        const newAddress = await dispatch(addAddress(values)).unwrap();
        addressId = newAddress.addressId;
        toast.success('Thêm địa chỉ thành công');
      }
      if (values.isDefault) {
        await dispatch(setDefaultAddress(addressId)).unwrap();
        await dispatch(fetchAddresses());
      }
      setIsAddressModalVisible(false);
      setEditingAddress(null);
      addressForm.resetFields();
    } catch {
      toast.error(editingAddress ? 'Cập nhật địa chỉ thất bại' : 'Thêm địa chỉ thất bại');
    }
  };

  const showAddressDetail = async (addressId) => {
    try {
      await dispatch(fetchAddressById(addressId)).unwrap();
      setIsAddressDetailVisible(true);
    } catch (error) {
      toast.error(error || 'Không thể tải thông tin địa chỉ');
    }
  };

  return (
    <Card>
      <Tabs defaultActiveKey={defaultTab}>
        <TabPane
          tab={
            <span>
              <UserOutlined />
                Hồ Sơ
            </span>
          }
          key="profile"
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdateProfile}
          >
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar
                size={100}
                src={avatarUrl}
                icon={<UserOutlined />}
              />
              <Form.Item>
                <Upload
                  maxCount={1}
                  beforeUpload={() => false}
                  showUploadList={false}
                  onChange={handleAvatarChange}
                  accept="image/*"
                >
                  <Button icon={<UploadOutlined />} style={{ marginTop: 8 }}>
                    Chọn Ảnh
                  </Button>
                </Upload>
              </Form.Item>
            </div>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="username"
                  label="Tên đăng nhập"
                >
                  <Input disabled />
                </Form.Item>

                <Form.Item
                  name="fullname"
                  label="Họ và tên"
                  rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
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
                  name="address"
                  label="Địa chỉ"
                  rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                >
                  <Input.TextArea rows={4} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Lưu Thay Đổi
              </Button>
            </Form.Item>
          </Form>
        </TabPane>

        <TabPane
          tab={
            <span>
              <LockOutlined />
              Đổi Mật Khẩu
            </span>
          }
          key="password"
        >
          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handleChangePassword}
          >
            <Form.Item
              name="oldPass"
              label="Mật khẩu hiện tại"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="newPass"
              label="Mật khẩu mới"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('oldPass') !== value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu mới không được trùng với mật khẩu cũ!'));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="confirmNewPass"
              label="Xác nhận mật khẩu mới"
              dependencies={['newPass']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPass') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Đổi Mật Khẩu
              </Button>
            </Form.Item>
          </Form>
        </TabPane>

        <TabPane
          tab={
            <span>
              <HomeOutlined />
              Địa Chỉ
            </span>
          }
          key="addresses"
        >
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
                  title={item.receiveName}
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
            visible={isAddressDetailVisible}
            onCancel={() => setIsAddressDetailVisible(false)}
            footer={[
              <Button key="close" onClick={() => setIsAddressDetailVisible(false)}>
                Đóng
              </Button>,
              <Button
                key="edit"
                type="primary"
                onClick={() => {
                  setIsAddressDetailVisible(false);
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
              </div>
            )}
          </Modal>

          <Modal
            title={editingAddress ? "Sửa Địa Chỉ" : "Thêm Địa Chỉ Mới"}
            visible={isAddressModalVisible}
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
                <Checkbox>Đặt làm địa chỉ mặc định</Checkbox>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {editingAddress ? 'Cập Nhật' : 'Thêm Địa Chỉ'}
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </TabPane>

        <TabPane
          tab={
            <span>
              <HeartOutlined />
              Danh Sách Yêu Thích
            </span>
          }
          key="wishlist"
        >
          <List
            itemLayout="horizontal"
            dataSource={wishlist}
            loading={loading}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Danh sách yêu thích trống"
                />
              )
            }}
            renderItem={item => (
              <List.Item
                actions={[
                  <Button danger onClick={() => handleRemoveFromWishlist(item.wishListId)}>
                    Xóa
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar 
                      src={item.productImage?.[0]} 
                      shape="square" 
                      size={64} 
                    />
                  }
                  title={
                    <Link to={`/products/${item.productId}`}>
                      {item.productName}
                    </Link>
                  }
                  description={
                    <div>
                      <div className="text-danger">
                        {item.productPrice?.toLocaleString('vi-VN')}đ
                      </div>
                      <div className="text-muted">
                        {item.productDescription}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </TabPane>

        <TabPane
          tab={
            <span>
              <HistoryOutlined />
              Lịch Sử Đơn Hàng
            </span>
          }
          key="orders"
        >
          <div style={{ marginBottom: 16 }}>
            <Select
              style={{ width: 200 }}
              placeholder="Lọc theo trạng thái"
              onChange={(value) => {
                if (value === 'ALL') {
                  dispatch(fetchOrderHistory());
                } else {
                  dispatch(fetchOrdersByStatus(value));
                }
              }}
              defaultValue="ALL"
            >
              <Select.Option value="ALL">Tất cả đơn hàng</Select.Option>
              {Object.entries(OrderStatus).map(([key, value]) => (
                <Select.Option key={key} value={value}>
                  {OrderStatusLabels[value]}
                </Select.Option>
              ))}
            </Select>
          </div>

          <Table
            loading={loading}
            dataSource={orders}
            rowKey="orderId"
            pagination={{
              pageSize: 10,
              showTotal: (total) => `Tổng ${total} đơn hàng`,
            }}
            locale={{
              emptyText: <Empty description="Bạn chưa có đơn hàng nào" />
            }}
            columns={[
              {
                title: 'Mã đơn hàng',
                dataIndex: 'serialNumber',
                key: 'serialNumber',
                width: 120,
                align: 'center',
                render: (text, record) => record.serialNumber || record.orderNumber,
              },
              {
                title: 'Ngày đặt',
                dataIndex: 'orderDate',
                key: 'orderDate',
                width: 150,
                align: 'center',
                render: (date) => new Date(date).toLocaleString('vi-VN'),
                sorter: (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
                defaultSortOrder: 'descend',
              },
              {
                title: 'Tên người nhận',
                dataIndex: 'receiveName',
                key: 'receiveName',
                width: 100,
                align: 'center',
              },
              {
                title: 'Số điện thoại',
                dataIndex: 'receivePhone',
                key: 'receivePhone',
                width: 110,
                align: 'center',
              },
              {
                title: 'Địa chỉ nhận hàng',
                dataIndex: 'receiveAddress',
                width: 200,
                ellipsis: {
                  showTitle: false,
                },
                render: (address) => (
                  <Tooltip placement="topLeft" title={address}>
                    {address}
                  </Tooltip>
                ),
              },
              {
                title: 'Tổng tiền',
                dataIndex: 'totalPrice',
                key: 'totalPrice',
                width: 150,
                align: 'right',
                render: (amount) => new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(amount),
              },
              {
                title: 'Trạng thái',
                dataIndex: 'orderStatus',
                key: 'orderStatus',
                width: 150,
                align: 'center',
                render: (status) => (
                  <Tag color={OrderStatusColors[status]}>
                    {OrderStatusLabels[status]}
                  </Tag>
                ),
              },
              {
                title: 'Thao tác',
                key: 'action',
                width: 120,
                align: 'center',
                render: (_, record) => (
                  <Space size="small">
                    <Button
                      type="text"
                      icon={<EyeOutlined />}
                      onClick={() => {
                        dispatch(fetchOrderDetail(record.serialNumber))
                          .unwrap()
                          .then((data) => {
                            setOrderDetail(data);
                            setIsOrderDetailVisible(true);
                          })
                          .catch(() => toast.error('Không thể tải chi tiết đơn hàng'));
                      }}
                    />
                    {record.orderStatus === OrderStatus.WAITING && (
                      <Popconfirm
                        title={`Bạn có chắc muốn hủy đơn hàng ${record.serialNumber}?`}
                        onConfirm={() => {
                          dispatch(cancelOrder(record.orderId))
                            .unwrap()
                            .then(() => {
                              toast.success('Hủy đơn hàng thành công');
                              dispatch(fetchOrderHistory());
                            })
                            .catch((error) => {
                              toast.error(error || 'Không thể hủy đơn hàng');
                            });
                        }}
                        okText="Có"
                        cancelText="Không"
                      >
                        <Button type="text" danger>
                          Hủy
                        </Button>
                      </Popconfirm>
                    )}
                  </Space>
                ),
              },
            ]}
          />

          <Modal
            title={`Chi tiết đơn hàng #${orderDetail?.serialNumber}`}
            visible={isOrderDetailVisible}
            onCancel={() => {
              setIsOrderDetailVisible(false);
              setOrderDetail(null);
            }}
            footer={null}
            width={800}
          >
            {orderDetail && (
              <div>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <h4>Thông tin đơn hàng</h4>
                    <p>Ngày đặt: {new Date(orderDetail.orderDate).toLocaleString('vi-VN')}</p>
                    <p>Trạng thái: <Tag color={OrderStatusColors[orderDetail.orderStatus]}>{OrderStatusLabels[orderDetail.orderStatus]}</Tag></p>
                    <p>Ghi chú: {orderDetail.note || 'Không có'}</p>
                  </Col>
                  <Col span={12}>
                    <h4>Thông tin giao hàng</h4>
                    <p>Người nhận: {orderDetail.receiveName}</p>
                    <p>Số điện thoại: {orderDetail.receivePhone}</p>
                    <p>Địa chỉ: {orderDetail.receiveAddress}</p>
                  </Col>
                </Row>

                <Divider />

                <h4>Chi tiết sản phẩm</h4>
                <Table
                  dataSource={orderDetail.orderDetails}
                  pagination={false}
                  rowKey="orderDetailId"
                  columns={[
                    {
                      title: 'Sản phẩm',
                      dataIndex: 'productName',
                      render: (text, record) => (
                        <Space>
                          <Avatar shape="square" size={64} src={record.mainImageUrl} />
                          <span>{text}</span>
                        </Space>
                      ),
                    },
                    {
                      title: 'Đơn giá',
                      dataIndex: 'unitPrice',
                      align: 'right',
                      render: (price) => new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(price),
                    },
                    {
                      title: 'Số lượng',
                      dataIndex: 'orderQuantity',
                      align: 'center',
                    },
                    {
                      title: 'Thành tiền',
                      align: 'right',
                      render: (_, record) => new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(record.unitPrice * record.orderQuantity),
                    },
                  ]}
                  summary={() => (
                    <Table.Summary.Row>
                      <Table.Summary.Cell colSpan={3} align="right">
                        <strong>Tổng tiền hàng:</strong>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell align="right">
                        <strong>
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          }).format(orderDetail.totalPrice)}
                        </strong>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  )}
                />

                <Row justify="end" style={{ marginTop: 16 }}>
                  <Col>
                    <Space direction="vertical" align="end">
                      <div>Tổng tiền hàng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderDetail.totalPrice)}</div>
                      <div>Phí vận chuyển: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderDetail.shippingFee || 0)}</div>
                      <div><strong>Tổng thanh toán: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderDetail.totalPrice + (orderDetail.shippingFee || 0))}</strong></div>
                    </Space>
                  </Col>
                </Row>
              </div>
            )}
          </Modal>
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default Account; 