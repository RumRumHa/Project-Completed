import { Space, Button, Popconfirm } from "antd";
import CommonTable from "./CommonTable";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";

const ProductTable = ({ columns, data, loading, page, limit, onEdit, onDelete, onView }) => {
  const defaultColumns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      width: 80,
      align: 'center',
      render: (_, __, index) => (page - 1) * limit + index + 1,
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'sku',
      key: 'sku',
      align: 'center',
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      align: 'center',
    },
    {
      title: 'Giá',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      align: 'center',
      render: (value) => value && value.toLocaleString('vi-VN'),
    },
    {
      title: 'Số lượng',
      dataIndex: 'stockQuantity',
      key: 'stockQuantity',
      align: 'center',
    },
    {
      title: 'Danh mục',
      dataIndex: 'categoryName',
      key: 'categoryName',
      align: 'center',
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined className="eye-icon" />} onClick={() => onView(record.productId)} />
          <Button icon={<EditOutlined className="edit-icon" />} onClick={() => onEdit(record)} />
          <Popconfirm title={`Xóa sản phẩm ${record.productName}?`} onConfirm={() => onDelete(record.productId)}>
            <Button icon={<DeleteOutlined className="delete-icon" />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <CommonTable
      columns={columns || defaultColumns}
      dataSource={data || []}
      rowKey="productId"
      pagination={false}
      loading={loading}
    />
  );
};

export default ProductTable;
