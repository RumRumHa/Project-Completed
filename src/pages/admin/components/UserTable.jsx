import { Space, Button, Popconfirm, Tag } from "antd";
import CommonTable from "./CommonTable";
import { DeleteOutlined, EditOutlined, EyeOutlined, LockOutlined, UnlockOutlined } from "@ant-design/icons";

const UserTable = ({ columns, data, loading, page, limit, onEdit, onDelete, onView, onToggleStatus }) => {
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
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      key: 'username',
      align: 'center',
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullname',
      key: 'fullname',
      align: 'center',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      align: 'center',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status) => status === true ? <Tag color="green">Kích hoạt</Tag> : <Tag color="red">Khoá</Tag>,
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined className="eye-icon" />} onClick={() => onView(record.userId)} />
          <Button icon={<EditOutlined className="edit-icon" />} onClick={() => onEdit(record)} />
          <Popconfirm title={`Xoá user ${record.username}?`} onConfirm={() => onDelete(record.userId)}>
            <Button icon={<DeleteOutlined className="delete-icon" />} danger />
          </Popconfirm>
          <Button
            icon={record.status === true ? <LockOutlined className="lock-icon" /> : <UnlockOutlined className="unlock-icon" />}
            onClick={() => onToggleStatus(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <CommonTable
      columns={columns || defaultColumns}
      dataSource={data || []}
      rowKey="userId"
      pagination={false}
      loading={loading}
    />
  );
};

export default UserTable;
