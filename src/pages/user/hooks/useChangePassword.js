import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Form } from 'antd';
import { changePassword } from '../../../redux/reducers/public/authSlice';

export default function useChangePassword() {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (values) => {
    setLoading(true);
    try {
      const { confirmNewPass, ...passwordData } = values;
      await dispatch(changePassword({
        ...passwordData,
        confirmNewPass: confirmNewPass
      })).unwrap();
      toast.success('Đổi mật khẩu thành công');
      form.resetFields();
    } catch (error) {
      toast.error(error || 'Đổi mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    handleChangePassword
  };
}
