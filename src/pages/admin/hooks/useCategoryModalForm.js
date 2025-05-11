import { useEffect, useState } from "react";
import { Form } from "antd";
import { useDispatch } from "react-redux";
import { createCategory, updateCategory } from "../../../redux/reducers/admin/categorySlice";
import { toast } from "react-toastify";

export default function useCategoryModalForm({ isModalOpen, editData, setIsModalOpen, refreshData }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    if (isModalOpen && !editData) {
      form.resetFields();
      setAvatarFile(null);
    } else if (isModalOpen && editData) {
      form.setFieldsValue(editData);
      if (editData.avatar) {
        setAvatarFile({
          uid: '-1',
          name: 'avatar.png',
          status: 'done',
          url: editData.avatar
        });
      } else {
        setAvatarFile(null);
      }
    }
  }, [isModalOpen, editData, form]);

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      toast.error('Chỉ được upload file ảnh!');
      return window.Upload ? window.Upload.LIST_IGNORE : false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      toast.error('Ảnh phải nhỏ hơn 5MB!');
      return window.Upload ? window.Upload.LIST_IGNORE : false;
    }
    return false;
  };

  const handleAvatarChange = ({ fileList }) => {
    const validFiles = fileList.filter(file => file.status !== 'removed');
    setAvatarFile(validFiles[0] || null);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('categoryName', values.categoryName);
    formData.append('description', values.description);
    if (avatarFile && avatarFile.originFileObj) {
      formData.append('avatar', avatarFile.originFileObj);
    }
    let result;
    if (editData) {
      result = await dispatch(updateCategory({ id: editData.categoryId, data: formData }));
    } else {
      result = await dispatch(createCategory(formData));
    }
    if (result.meta.requestStatus === "fulfilled") {
      toast.success(editData ? "Cập nhật thành công!" : "Thêm mới thành công!");
      setIsModalOpen(false);
      refreshData();
    } else {
      toast.error("Lỗi khi lưu danh mục.");
    }
    setLoading(false);
  };


  return {
    form,
    loading,
    handleSubmit,
    avatarProps: {
      avatarFile,
      setAvatarFile,
      handleAvatarChange,
      beforeUpload
    }
  };
}
