import React, { useEffect } from "react";
import { Form, Input, Button, Space, Upload } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";

const ModalCategoryForm = ({
  form,
  editData,
  handleCancel,
  onFinish,
  avatarProps,
}) => {
  useEffect(() => {
    if (editData) {
      form.setFieldsValue(editData);
    } else {
      form.resetFields();
    }
  }, [editData, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
      <Form.Item
        label="Ảnh"
        name="avatar"
        extra="Ảnh định dạng JPG/PNG, tối đa 5MB"
        rules={[
          {
            validator: (_, value) => {
              if (!editData && (!value || value.length === 0)) {
                return Promise.reject(new Error('Vui lòng tải lên ảnh!'));
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
        label="Tên danh mục"
        name="categoryName"
        rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
      >
        <Input placeholder="Nhập tên danh mục" />
      </Form.Item>

      <Form.Item
        label="Mô tả"
        name="description"
        rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
      >
        <Input.TextArea
          placeholder="Nhập mô tả"
          autoSize={{ minRows: 3, maxRows: 5 }}
        />
      </Form.Item>

      <Form.Item className="modal-edit">
        <Space>
          <Button onClick={handleCancel}>Hủy bỏ</Button>
          <Button
            type="primary"
            htmlType="submit"
            icon={editData ? <EditOutlined /> : <PlusOutlined />}
          >
            {editData ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ModalCategoryForm;
