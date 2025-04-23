import { Table, Space, Button, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";

const CategoryTable = ({ columns, data, loading, page, limit, onEdit, onDelete, onView }) => {
  // columns: nếu muốn custom truyền vào, hoặc có thể định nghĩa ở đây
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
      title: 'Tên danh mục',
      dataIndex: 'categoryName',
      key: 'categoryName',
      align: 'center',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
      ellipsis: true,
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined className="eye-icon" />} onClick={() => onView(record.categoryId)} />
          <Button icon={<EditOutlined className="edit-icon" />} onClick={() => onEdit(record)} />
          <Popconfirm title={`Xóa danh mục ${record.categoryName}?`} onConfirm={() => onDelete(record.categoryId)}>
            <Button icon={<DeleteOutlined className="delete-icon" />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns || defaultColumns}
      dataSource={data || []}
      rowKey="categoryId"
      pagination={false}
      loading={loading}
      bordered
    />
  );
};

export default CategoryTable;
