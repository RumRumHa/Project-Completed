import React from 'react';
import BaseModal from './components/BaseModal';
import ModalProductForm from './components/ModalProductForm';
import ModalProductView from './components/ModalProductView';
import useProductModalForm from './hooks/useProductModalForm';

const ModalProduct = ({
  isModalOpen,
  setIsModalOpen,
  handleCancel,
  editData,
  refreshData,
  categories,
  isViewMode,
  setIsViewMode
}) => {
  const {
    form,
    loading,
    mainImageProps,
    additionalImagesProps,
    handleSubmit
  } = useProductModalForm({ isModalOpen, editData, setIsModalOpen, refreshData, categories, setIsViewMode });

  return (
    <BaseModal
      title={isViewMode ? '👁️ Chi tiết sản phẩm' : (editData ? '✏️ Cập nhật sản phẩm' : '➕ Thêm sản phẩm mới')}
      open={isModalOpen}
      onCancel={handleCancel}
      loading={loading}
      width={700}
      destroyOnClose
    >
      {isViewMode ? (
        <ModalProductView
          editData={editData}
          handleCancel={handleCancel}
          setIsViewMode={setIsViewMode}
        />
      ) : (
        <ModalProductForm
          form={form}
          editData={editData}
          categories={categories}
          mainImageProps={mainImageProps}
          additionalImagesProps={additionalImagesProps}
          handleCancel={handleCancel}
          onFinish={handleSubmit}
          loading={loading}
        />
      )}
    </BaseModal>
  );
};

export default ModalProduct;