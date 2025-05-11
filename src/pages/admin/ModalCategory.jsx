import React from "react";
import BaseModal from "./components/BaseModal";
import ModalCategoryForm from "./components/ModalCategoryForm";
import ModalCategoryView from "./components/ModalCategoryView";
import useCategoryModalForm from "./hooks/useCategoryModalForm";

const ModalCategory = ({
  isModalOpen,
  setIsModalOpen,
  handleCancel,
  editData,
  refreshData,
  isViewMode,
  setIsViewMode
}) => {
  const {
    form,
    loading,
    handleSubmit,
    avatarProps
  } = useCategoryModalForm({ isModalOpen, editData, setIsModalOpen, refreshData });

  return (
    <BaseModal
      title={isViewMode ? "👁️ Chi tiết danh mục" : (editData ? "✏️ Cập nhật danh mục" : "➕ Thêm danh mục mới")}
      open={isModalOpen}
      onCancel={handleCancel}
      loading={loading}
      width={500}
      bodyStyle={{ padding: 24 }}
    >
      {isViewMode ? (
        <ModalCategoryView editData={editData} handleCancel={handleCancel} setIsViewMode={setIsViewMode} />
      ) : (
        <ModalCategoryForm
          form={form}
          editData={editData}
          handleCancel={handleCancel}
          onFinish={handleSubmit}
          loading={loading}
          avatarProps={avatarProps}
        />
      )}
    </BaseModal>
  );
};

export default ModalCategory;
