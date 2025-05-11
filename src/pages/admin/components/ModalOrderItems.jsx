import { Table } from "antd";
import { formatPrice } from "../../../utils/formatPrice";

const ModalOrderItems = ({ items }) => {
  const columns = [
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
      render: (price) => formatPrice(price),
    },
    {
      title: 'Thành tiền',
      dataIndex: 'total',
      key: 'total',
      align: 'right',
      width: 150,
      render: (_, record) => formatPrice(record.orderQuantity * record.unitPrice),
    },
  ];
  return (
    <Table
      columns={columns}
      dataSource={items}
      rowKey="orderDetailId"
      pagination={false}
      bordered
      size="small"
      style={{ marginTop: 16 }}
    />
  );
};

export default ModalOrderItems;
