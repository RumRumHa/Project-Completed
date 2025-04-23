import React, { useEffect } from "react";
import { Form, Input, Button, Space } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";

const ModalCategoryForm = ({
  form,
  editData,
  handleCancel,
  onFinish
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
