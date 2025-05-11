import React from 'react';
import { Form, Input, Button, Avatar, Upload, Row, Col } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';

const ProfileInfo = ({ form, avatarUrl, loading, handleAvatarChange, handleUpdateProfile }) => (
  <Form
    form={form}
    layout="vertical"
    onFinish={handleUpdateProfile}
  >
    <div style={{ textAlign: 'center', marginBottom: 24 }}>
      <Avatar
        size={100}
        src={avatarUrl}
        icon={<UserOutlined />}
      />
      <Form.Item>
        <Upload
          maxCount={1}
          beforeUpload={() => false}
          showUploadList={false}
          onChange={handleAvatarChange}
          accept="image/*"
        >
          <Button icon={<UploadOutlined />} style={{ marginTop: 8 }}>
            Chọn Ảnh
          </Button>
        </Upload>
      </Form.Item>
    </div>
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item name="username" label="Tên đăng nhập">
          <Input disabled />
        </Form.Item>
        <Form.Item name="fullname" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[
          { required: true, message: 'Vui lòng nhập email!' },
          { type: 'email', message: 'Email không hợp lệ!' }
        ]}>
          <Input />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="phone" label="Số điện thoại" rules={[
          { required: true, message: 'Vui lòng nhập số điện thoại!' },
          { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' }
        ]}>
          <Input />
        </Form.Item>
        <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}> 
          <Input.TextArea rows={4} />
        </Form.Item>
      </Col>
    </Row>
    <Form.Item>
      <Button type="primary" htmlType="submit" loading={loading}>
        Lưu Thay Đổi
      </Button>
    </Form.Item>
  </Form>
);

export default ProfileInfo;
