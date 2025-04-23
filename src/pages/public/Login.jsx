import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../redux/reducers/public/authSlice';
import { toast } from 'react-toastify';
import '../../styles/public/index.css';

const { Title, Text } = Typography;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const error = useSelector(state => state.authPublic.error);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const onFinish = async (values) => {
    setLoading(true);
    dispatch(login(values))
      .unwrap()
      .then((response) => {
        const roles = Array.isArray(response.roles) ? response.roles : [response.roles];
        toast.success('Đăng nhập thành công!');
        if (roles.includes('ADMIN')) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      })
      .finally(() => setLoading(false));
  };


  return (
    <div className="login-container">
      <div className="login-form">
        <div className='login-form-header'>
          <Title className='text-primary mb-2' level={2}>Đăng nhập</Title>
          <Text type="secondary">Chào mừng bạn trở lại!</Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input 
              prefix={<UserOutlined className='login-icon' />}
              placeholder="Tên đăng nhập"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className='login-icon' />}
              placeholder="Mật khẩu"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              className='text-white bg-primary login-button-submit'
              loading={loading}
            >
              Đăng nhập
            </Button>
          </Form.Item>

          <div className='text-center'>
            <Text type="secondary">
              Bạn chưa có tài khoản?{' '}
              <Link to="/register" className='text-primary fw-bold'>
                Đăng ký ngay
              </Link>
            </Text>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;