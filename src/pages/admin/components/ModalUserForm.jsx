import React from "react";
import { Form, Input, Button, Select, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
const { Option } = Select;

const ModalUserForm = ({
  form,
  editData,
  roles,
  loading,
  handleCancel,
  onFinish,
  avatarProps
}) => {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      key={editData ? editData.userId : 'new'}
    >
      <Form.Item
        label="Ảnh đại diện"
        name="avatar"
        extra="Ảnh định dạng JPG/PNG, tối đa 5MB"
        rules={[
          {
            validator: (_, value) => {
              if (!editData && (!value || value.length === 0)) {
                return Promise.reject(new Error('Vui lòng tải lên ảnh đại diện!'));
              }
              return Promise.resolve();
            },
          },
        ]}
        getValueFromEvent={(e) => {
          if (Array.isArray(e)) {
            return e;
          }
          return e?.fileList;
        }}
      >
        <Upload
          listType="picture-card"
          beforeUpload={avatarProps?.beforeUpload}
          onChange={avatarProps?.handleAvatarChange}
          onRemove={() => avatarProps?.setAvatarFile(null)}
          maxCount={1}
          accept="image/*"
          fileList={avatarProps?.avatarFile ? [avatarProps?.avatarFile] : []}
        >
          {!avatarProps?.avatarFile && (
            <div>
              <PlusOutlined />
              <div className="modal-avatar-text">Tải lên</div>
            </div>
          )}
        </Upload>
      </Form.Item>
      <Form.Item
        label="Tên đăng nhập"
        name="username"
        rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
      >
        <Input disabled={!!editData} />
      </Form.Item>
      <Form.Item
        label="Mật khẩu"
        name="password"
        rules={[
          { required: !editData, message: "Vui lòng nhập mật khẩu!" },
          { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" }
        ]}
        extra={editData ? "Để trống nếu không muốn thay đổi mật khẩu" : ""}
      >
        <Input.Password placeholder={editData ? "Nhập mật khẩu mới" : "Nhập mật khẩu"} />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Vui lòng nhập email!" },
          { type: "email", message: "Email không hợp lệ!" }
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Họ tên"
        name="fullname"
        rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Số điện thoại"
        name="phone"
        rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Địa chỉ"
        name="address"
        rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
      >
        <Input />
      </Form.Item>
      {editData && (
        <Form.Item
          label="Quyền"
          name="roleName"
          rules={[{ required: true, message: "Vui lòng chọn quyền!" }]}
        >
          <Select mode="multiple" placeholder="Chọn quyền">
            {roles?.map((role) => (
              <Option key={role.roleId} value={role.roleName}>
                {role.roleName}
              </Option>
            ))}
          </Select>
        </Form.Item>
      )}
      <Form.Item className="modal-edit">
        <Button onClick={handleCancel} className="modal-edit-button">
          Hủy bỏ
        </Button>
        <Button type="primary" htmlType="submit" loading={loading}>
          {editData ? "Cập nhật" : "Thêm mới"}
        </Button>
      </Form.Item>
    </Form>
  );
};
export default ModalUserForm;
