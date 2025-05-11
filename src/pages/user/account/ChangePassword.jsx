import React from 'react';
import { Form, Input, Button } from 'antd';

const ChangePassword = ({ form, loading, handleChangePassword }) => (
  <Form
    form={form}
    layout="vertical"
    onFinish={handleChangePassword}
  >
    <Form.Item
      name="oldPass"
      label="Mật khẩu hiện tại"
      rules={[
        { required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' },
        { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
      ]}
    >
      <Input.Password />
    </Form.Item>
    <Form.Item
      name="newPass"
      label="Mật khẩu mới"
      rules={[
        { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
        { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
      ]}
    >
      <Input.Password />
    </Form.Item>
    <Form.Item
      name="confirmNewPass"
      label="Xác nhận mật khẩu mới"
      dependencies={["newPass"]}
      rules={[
        { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue('newPass') === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
          },
        }),
      ]}
    >
      <Input.Password />
    </Form.Item>
    <Form.Item>
      <Button type="primary" htmlType="submit" loading={loading}>
        Đổi Mật Khẩu
      </Button>
    </Form.Item>
  </Form>
);

export default ChangePassword;
