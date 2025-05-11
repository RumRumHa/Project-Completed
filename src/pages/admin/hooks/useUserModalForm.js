import { useEffect, useState } from "react";
import { Form, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { createUser, updateUser } from "../../../redux/reducers/admin/userSlice";
import { getRoles } from "../../../redux/reducers/admin/roleSlice";
import { toast } from "react-toastify";
import { userService } from "../../../services/admin/userService";

export default function useUserModalForm({ isModalOpen, editData, setIsModalOpen, refreshData, setIsViewMode }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { data: roles } = useSelector((state) => state.roleAdmin);
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      dispatch(getRoles());
      if (editData) {
        form.setFieldsValue({
          username: editData.username,
          email: editData.email,
          fullname: editData.fullname,
          phone: editData.phone,
          address: editData.address,
          status: !!editData.status,
          roleName: Array.isArray(editData.roleName)
            ? editData.roleName.map(r => typeof r === 'object' ? r.roleName : r)
            : []
        });
        if (editData.avatar) {
          setAvatarFile({
            uid: '-1',
            name: 'avatar.png',
            status: 'done',
            url: editData.avatar
          });
        }
      } else {
        form.resetFields();
        setAvatarFile(null);
      }
    }
  }, [editData, isModalOpen, form, dispatch]);

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Chỉ được upload file ảnh!');
      return window.Upload ? window.Upload.LIST_IGNORE : false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Ảnh phải nhỏ hơn 5MB!');
      return window.Upload ? window.Upload.LIST_IGNORE : false;
    }
    return false;
  };

  const handleAvatarChange = ({ fileList }) => {
    const validFiles = fileList.filter(file => file.status !== 'removed');
    setAvatarFile(validFiles[0] || null);
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        if (key !== 'avatar' && key !== 'roleName' && values[key] !== undefined) {
          if (key === 'status') {
            formData.append(key, values[key] ? 'true' : 'false');
          } else {
            formData.append(key, values[key]);
          }
        }
      });
      if (avatarFile?.originFileObj) {
        formData.append('avatar', avatarFile.originFileObj);
      }
      if (editData) {
        const result = await dispatch(updateUser({
          userId: editData.userId,
          formData
        })).unwrap();
        if (result) {
          const currentRoles = editData.roleName || [];
          const newRoles = values.roleName || [];
          for (const role of newRoles) {
            if (!currentRoles.includes(role)) {
              await handleAddRole(editData.userId, role);
            }
          }
          for (const role of currentRoles) {
            if (!newRoles.includes(role)) {
              await handleRemoveRole(editData.userId, role);
            }
          }
          toast.success("Cập nhật người dùng thành công!");
          setIsModalOpen(false);
          refreshData();
        }
      } else {
        const result = await dispatch(createUser(formData)).unwrap();
        if (result) {
          toast.success("Thêm người dùng thành công!");
          setIsModalOpen(false);
          refreshData();
        }
      }
    } catch {
      toast.error("Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  const handleAddRole = async (userId, roleName) => {
    const role = roles?.find(r => r.roleName === roleName);
    if (!role) {
      toast.error(`Không tìm thấy quyền ${roleName}!`);
      return;
    }
    try {
      const response = await userService.addRoleToUser(userId, role.roleId);
      if (response) {
        toast.success(`Thêm quyền ${roleName} thành công!`);
        refreshData();
      }
    } catch (error) {
      toast.error(`Lỗi khi thêm quyền ${roleName}: ${error.message}`);
    }
  };

  const handleRemoveRole = async (userId, roleName) => {
    const role = roles?.find(r => r.roleName === roleName);
    if (!role) {
      toast.error(`Không tìm thấy quyền ${roleName}!`);
      return;
    }
    try {
      const response = await userService.removeRoleFromUser(userId, role.roleId);
      if (response) {
        toast.success(`Xóa quyền ${roleName} thành công!`);
        refreshData();
      }
    } catch (error) {
      toast.error(`Lỗi khi xóa quyền ${roleName}: ${error.message}`);
    }
  };

  return {
    form,
    roles,
    loading,
    avatarProps: {
      avatarFile,
      setAvatarFile,
      handleAvatarChange,
      beforeUpload
    },
    handleSubmit
  };
}
