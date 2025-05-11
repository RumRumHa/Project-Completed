import { Spin, Tag, Button, Popconfirm, Space } from "antd";
import CommonTable from "./CommonTable";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { OrderStatusLabels, OrderStatusColors } from "../../../enums/OrderStatus";
import { formatPrice } from "../../../utils/formatPrice";

const OrderTable = ({ data, loading, page, limit, onView, onDelete }) => {
  const getStatusColor = (status) => OrderStatusColors[status] || 'default';
  const getStatusText = (status) => OrderStatusLabels[status] || status;

  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      width: 50,
      align: 'center',
      fixed: 'left',
      render: (_, __, index) => (page - 1) * limit + index + 1,
    },
    {
      title: 'Mã đơn hàng',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
      width: 120,
      align: 'center',
    },
    {
      title: 'Khách hàng',
      dataIndex: 'userName',
      key: 'userName',
      width: 150,
      ellipsis: true,
      align: 'center',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'receivePhone',
      key: 'receivePhone',
      width: 120,
      align: 'center',
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      align: 'center',
      render: (date) => new Date(date).toLocaleString('vi-VN'),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      width: 100,
      align: 'right',
      render: (amount) => (
        formatPrice(amount)
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 200,
      align: 'left',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 100,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Space size={0}>
          <Button 
            type="text"
            size="small"
            icon={<EyeOutlined className="eye-icon" />}
            onClick={() => onView(record.orderId)}
          />
          <Popconfirm
            title={`Xóa đơn hàng ${record.serialNumber}?`}
            onConfirm={() => onDelete(record.orderId)}
          >
            <Button 
              type="text"
              size="small"
              icon={<DeleteOutlined className="delete-icon" />}
              danger
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <CommonTable
      columns={columns}
      dataSource={data}
      rowKey="orderId"
      loading={loading}
      pagination={false}
      scroll={{ x: 1000 }}
    />
  );
};

export default OrderTable;
