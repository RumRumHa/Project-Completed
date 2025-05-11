import React, { useEffect, useState } from "react";
import { Form } from "antd";
import BaseModal from "./components/BaseModal";
import ModalUserForm from "./components/ModalUserForm";
import ModalUserView from "./components/ModalUserView";
import useUserModalForm from "./hooks/useUserModalForm";

const ModalUser = ({
  isModalOpen,
  setIsModalOpen,
  handleCancel,
  editData,
  refreshData,
  isViewMode,
  setIsViewMode,
}) => {
  const {
    form,
    roles,
    loading,
    avatarProps,
    handleSubmit 
  } = useUserModalForm({ isModalOpen, editData, setIsModalOpen, refreshData, setIsViewMode });

  return (
    <BaseModal
      key={editData ? editData.userId : 'new'}
      title={isViewMode ? "Chi tiết người dùng" : (editData ? "Cập nhật người dùng" : "Thêm người dùng")}
      open={isModalOpen}
      onCancel={handleCancel}
      loading={loading}
      width={800}
    >
      {isViewMode ? (
        <ModalUserView editData={editData} setIsViewMode={setIsViewMode} />
      ) : (
        <ModalUserForm
          form={form}
          editData={editData}
          roles={roles}
          loading={loading}
          handleCancel={handleCancel}
          onFinish={handleSubmit}
          avatarProps={avatarProps}
        />
      )}
    </BaseModal>
  );
};

export default ModalUser; 