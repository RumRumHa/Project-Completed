import React from "react";
import { Button, Space, Descriptions } from "antd";

const ModalCategoryView = ({ editData, handleCancel, setIsViewMode }) => {
  return (
    <div>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Tên danh mục">{editData.categoryName}</Descriptions.Item>
        <Descriptions.Item label="Mô tả">{editData.description}</Descriptions.Item>
      </Descriptions>

      <div className="modal-edit">
        <Space>
          <Button onClick={handleCancel}>Đóng</Button>
          <Button 
            type="primary" 
            onClick={() => {
              setIsViewMode(false);
            }}
          >
            Chỉnh sửa
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default ModalCategoryView;
