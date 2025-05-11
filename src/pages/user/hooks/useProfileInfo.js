import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Form } from 'antd';
import { fetchAccountInfo, updateAccountInfo } from '../../../redux/reducers/user/accountSlice';

export default function useProfileInfo() {
  const dispatch = useDispatch();
  const { accountInfo, loading } = useSelector(state => state.account);
  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    dispatch(fetchAccountInfo());
  }, [dispatch]);

  useEffect(() => {
    if (accountInfo) {
      form.setFieldsValue({
        username: accountInfo.username,
        fullname: accountInfo.fullname,
        email: accountInfo.email,
        phone: accountInfo.phone,
        address: accountInfo.address
      });
      setAvatarUrl(accountInfo.avatar);
    }
  }, [accountInfo, form]);

  const handleAvatarChange = (info) => {
    if (info.file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarUrl(e.target.result);
      };
      reader.readAsDataURL(info.file);
      
      setAvatarFile(info.file);
    }
  };

  const handleUpdateProfile = async (values) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        if (values[key] !== undefined && key !== 'avatar') {
          formData.append(key, values[key]);
        }
      });
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }
      await dispatch(updateAccountInfo(formData)).unwrap();
      toast.success('Cập nhật thông tin thành công');
      setAvatarFile(null);
    } catch {
      toast.error('Cập nhật thông tin thất bại');
    }
  };

  return {
    form,
    avatarUrl,
    loading,
    handleAvatarChange,
    handleUpdateProfile
  };
}
