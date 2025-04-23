import React from "react";
import { Modal, Form } from "antd";
import { useDispatch } from "react-redux";
import { createCategory, updateCategory } from "../../redux/reducers/admin/categorySlice";
import { toast } from "react-toastify";
import ModalCategoryForm from "./components/ModalCategoryForm";
import ModalCategoryView from "./components/ModalCategoryView";

const ModalCategory = ({ 
  isModalOpen, 
  setIsModalOpen, 
  handleCancel, 
  editData,
  refreshData,
  isViewMode,
  setIsViewMode
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (isModalOpen && !editData) {
      form.resetFields();
    }
  }, [isModalOpen, editData, form]);

  const handleSubmit = async (values) => {
    let result;
    if (editData) {
      result = await dispatch(updateCategory({ id: editData.categoryId, data: values }));
    } else {
      result = await dispatch(createCategory(values));
    }
    if (result.meta.requestStatus === "fulfilled") {
      toast.success(editData ? "Cập nhật thành công!" : "Thêm mới thành công!");
      setIsModalOpen(false);
      refreshData();
    } else {
      toast.error("Lỗi khi lưu danh mục.");
    }
  };

  return (
    <Modal
      title={isViewMode ? "👁️ Chi tiết danh mục" : (editData ? "✏️ Cập nhật danh mục" : "➕ Thêm danh mục mới")}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      centered
      width={500}
      bodyStyle={{ padding: 24 }}
    >
      {isViewMode ? (
        <ModalCategoryView editData={editData} handleCancel={handleCancel} setIsViewMode={setIsViewMode} />
      ) : (
        <ModalCategoryForm form={form} editData={editData} handleCancel={handleCancel} onFinish={handleSubmit} />
      )}
    </Modal>
  );
};

export default ModalCategory;
