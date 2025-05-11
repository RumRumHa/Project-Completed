import React from "react";
import { Button, Space, Descriptions } from "antd";

const ModalCategoryView = ({ editData, handleCancel, setIsViewMode }) => {
  return (
    <div>
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Ảnh">
          {editData.avatar && (
            <img
              src={editData.avatar}
              alt="Avatar"
              style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', marginBottom: 16, border: '1px solid #eee' }}
            />
          )}
        </Descriptions.Item>
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
