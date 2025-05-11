import React from 'react';
import { Table, Select, Button, Tag, Space, Empty, Tooltip, Modal, Row, Col, Divider, Avatar, Popconfirm } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { OrderStatusLabels, OrderStatusColors } from '../../../enums/OrderStatus';
import {formatPrice} from '../../../utils/formatPrice';
const OrderHistory = ({
  orders,
  loading,
  OrderStatus,
  handleStatusFilter,
  handleShowOrderDetail,
  handleCancelOrder
}) => (
  <>
    <div style={{ marginBottom: 16 }}>
      <Select
        style={{ width: 200 }}
        placeholder="Lọc theo trạng thái"
        onChange={handleStatusFilter}
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
      dataSource={orders}
      loading={loading}
      rowKey="orderId"
      locale={{ emptyText: <Empty description="Không có đơn hàng nào" /> }}
      columns={[
        {
          title: 'Mã đơn',
          dataIndex: 'serialNumber',
          render: (text, record) => record.serialNumber || record.orderNumber,
        },
        {
          title: 'Ngày đặt',
          dataIndex: 'orderDate',
          render: (date) => new Date(date).toLocaleString('vi-VN'),
          sorter: (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
          defaultSortOrder: 'descend',
        },
        {
          title: 'Trạng thái',
          dataIndex: 'orderStatus',
          render: (status) => (
            <Tag color={OrderStatusColors[status]}>
              {OrderStatusLabels[status]}
            </Tag>
          ),
        },
        {
          title: 'Địa chỉ nhận',
          dataIndex: 'receiveAddress',
          render: (address) => (
            <Tooltip placement="topLeft" title={address}>
              {address}
            </Tooltip>
          ),
        },
        {
          title: 'Tổng tiền',
          dataIndex: 'totalPrice',
          render: (amount) => formatPrice(amount),
        },
        {
          title: 'Thao tác',
          key: 'action',
          render: (_, record) => (
            <Space size="small">
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => handleShowOrderDetail(record.serialNumber || record.orderNumber)}
              />
              {record.orderStatus === OrderStatus.WAITING && (
                <Popconfirm
                  title={`Bạn có chắc muốn hủy đơn hàng ${record.serialNumber}?`}
                  onConfirm={() => handleCancelOrder(record.orderId)}
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
      pagination={{ pageSize: 8 }}
    />
  </>
);

export default OrderHistory;
