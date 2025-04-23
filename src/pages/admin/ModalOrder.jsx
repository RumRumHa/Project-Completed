import React from "react";
import { Modal, Descriptions, Button, Space, Select, Tag, Table } from "antd";
import { useDispatch } from "react-redux";
import { updateOrderStatus } from "../../redux/reducers/admin/orderSlice";
import { toast } from "react-toastify";
import { OrderStatus, OrderStatusLabels, OrderStatusNotes } from "../../enums/OrderStatus";
import { formatPrice } from "../../utils/formatPrice";

const { Option } = Select;

const ModalOrder = ({ 
  open, 
  onCancel, 
  data: initialData,
  onSuccess,
  isView
}) => {
  const dispatch = useDispatch();
  const [data, setData] = React.useState(initialData);

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleStatusChange = async (status) => {
    try {
      const note = OrderStatusNotes[status];
      
      await dispatch(updateOrderStatus({ 
        orderId: data.orderId, 
        status,
        note
      })).unwrap();
      
      setData(prev => ({
        ...prev,
        status,
        note
      }));
      
      toast.success("Cập nhật trạng thái đơn hàng thành công!");
      onSuccess?.();
    } catch (error) {
      toast.error(error?.message || "Lỗi khi cập nhật trạng thái đơn hàng");
    }
  };

  const orderItemsColumns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      width: 50,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      align: 'left',
    },
    {
      title: 'Số lượng',
      dataIndex: 'orderQuantity',
      key: 'orderQuantity',
      align: 'center',
      width: 100,
    },
    {
      title: 'Đơn giá',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      align: 'right',
      width: 150,
      render: (price) => (
        formatPrice(price)
      ),
    },
    {
      title: 'Thành tiền',
      dataIndex: 'total',
      key: 'total',
      align: 'right',
      width: 150,
      render: (_, record) => (
        formatPrice(record.orderQuantity * record.unitPrice)
      ),
    },
  ];

  const renderView = () => {
    if (!data) {
      return <div>Đang tải dữ liệu...</div>;
    }

    return (
      <div>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Mã đơn hàng">{data.serialNumber}</Descriptions.Item>
          <Descriptions.Item label="Ngày đặt hàng">
            {new Date(data.createdAt).toLocaleString('vi-VN')}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày nhận hàng">
            {data.receivedAt ? new Date(data.receivedAt).toLocaleString('vi-VN') : 'Chưa nhận hàng'}
          </Descriptions.Item>
          <Descriptions.Item label="Khách hàng">{data.userName}</Descriptions.Item>
          <Descriptions.Item label="Người nhận">{data.receiveName}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">{data.receivePhone}</Descriptions.Item>
          <Descriptions.Item label="Địa chỉ nhận hàng" span={2}>{data.receiveAddress}</Descriptions.Item>
          <Descriptions.Item label="Ghi chú" span={2}>{data.note || 'Không có ghi chú'}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Select
              value={data.status}
              onChange={handleStatusChange}
              style={{ width: 200 }}
              disabled={isView}
            >
              {Object.entries(OrderStatus).map(([value]) => (
                <Option key={value} value={value}>
                  {OrderStatusLabels[value]}
                </Option>
              ))}
            </Select>
          </Descriptions.Item>
          <Descriptions.Item label="Tổng tiền">
            <Tag color="blue">
              {formatPrice(data.totalPrice)}
            </Tag>
          </Descriptions.Item>
        </Descriptions>

        <div style={{ marginTop: 24 }}>
          <h3>Chi tiết đơn hàng</h3>
          <Table
            columns={orderItemsColumns}
            dataSource={data.orderDetails}
            rowKey="orderDetailId"
            pagination={false}
            bordered
          />
        </div>
      </div>
    );
  };

  return (
    <Modal
      title="👁️ Chi tiết đơn hàng"
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      width={800}
      bodyStyle={{ padding: 24 }}
    >
      {renderView()}
    </Modal>
  );
};

export default ModalOrder; 