import { Space, Button, Popconfirm } from "antd";
import CommonTable from "./CommonTable";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";

const CategoryTable = ({ columns, data, loading, page, limit, onEdit, onDelete, onView }) => {
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
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      align: 'center',
      render: (avatar) => (
        avatar ? (
          <img
            src={avatar}
            alt="avatar"
            style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', background: '#f0f0f0' }}
          />
        ) : (
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>
            <span style={{ fontSize: 18 }}>
              <i className="fas fa-image" />
            </span>
          </div>
        )
      ),
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
    <CommonTable
      columns={columns || defaultColumns}
      dataSource={data || []}
      rowKey="categoryId"
      pagination={false}
      loading={loading}
    />
  );
};

export default CategoryTable;
