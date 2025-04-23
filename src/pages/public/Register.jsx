import React, { useState } from 'react';
import { Form, Input, Button, Typography, Upload } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, UserAddOutlined, HomeOutlined, UploadOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../redux/reducers/public/authSlice';
import { toast } from 'react-toastify';
import '../../styles/public/index.css'

const { Title, Text } = Typography;

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const avatarFile = values.avatar && values.avatar[0] && values.avatar[0].originFileObj;
      if (!avatarFile) {
        toast.error('Vui lòng chọn ảnh đại diện!');
        return;
      }
      const { confirmPassword, avatar, ...registerData } = values;
      const formData = { ...registerData, avatar: avatarFile };
      await dispatch(register(formData)).unwrap();

      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
  
    } catch (error) {
      toast.error(error?.message || 'Đăng ký thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <div className="register-form-header">
          <Title level={2} className="mb-2 text-primary">Đăng ký</Title>
          <Text type="secondary">Tạo tài khoản mới</Text>
        </div>

        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input 
              prefix={<UserOutlined className="register-icon" />}
              placeholder="Tên đăng nhập"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="register-icon" />}
              placeholder="Mật khẩu"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="register-icon" />}
              placeholder="Xác nhận mật khẩu"
            />
          </Form.Item>

          <Form.Item
            name="fullName"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
          >
            <Input 
              prefix={<UserAddOutlined className="register-icon" />}
              placeholder="Họ và tên"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input 
              prefix={<MailOutlined className="register-icon" />}
              placeholder="Email"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại!' },
              { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' }
            ]}
          >
            <Input 
              prefix={<PhoneOutlined className="register-icon" />}
              placeholder="Số điện thoại"
            />
          </Form.Item>

          <Form.Item
            name="address"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <Input 
              prefix={<HomeOutlined className="register-icon" />}
              placeholder="Địa chỉ"
            />
          </Form.Item>

          <Form.Item
            name="avatar"
            label="Ảnh đại diện"
            rules={[{ required: true, message: 'Vui lòng chọn ảnh đại diện!' }]}
            valuePropName="fileList"
            getValueFromEvent={e => Array.isArray(e) ? e : e && e.fileList}
          >
            <Upload
              accept="image/*"
              maxCount={1}
              listType="picture"
              beforeUpload={() => false}
              showUploadList={true}
            >
              <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              className='register-button-submit'
            >
              Đăng ký
            </Button>
          </Form.Item>

          <div className='text-center'>
            <Text type="secondary">
              Đã có tài khoản?{' '}
              <Link to="/login">
                Đăng nhập ngay
              </Link>
            </Text>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;