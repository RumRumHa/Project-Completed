import React from "react";
import { Button, Tag, Descriptions } from "antd";

const ModalUserView = ({ editData, setIsViewMode }) => (
  <div>
    <Descriptions column={1} bordered>
      <Descriptions.Item label="Ảnh đại diện">
        {editData?.avatar && (
          <img
            src={editData.avatar}
            alt="Avatar"
            className="modal-avatar"
          />
        )}
      </Descriptions.Item>
      <Descriptions.Item label="Tên đăng nhập">{editData?.username}</Descriptions.Item>
      <Descriptions.Item label="Mật khẩu">********</Descriptions.Item>
      <Descriptions.Item label="Email">{editData?.email}</Descriptions.Item>
      <Descriptions.Item label="Họ tên">{editData?.fullname}</Descriptions.Item>
      <Descriptions.Item label="Số điện thoại">{editData?.phone}</Descriptions.Item>
      <Descriptions.Item label="Địa chỉ">{editData?.address}</Descriptions.Item>
      <Descriptions.Item label="Quyền">
        {editData?.roleName?.map((role) => (
          <Tag key={role} color="blue">
            {role}
          </Tag>
        ))}
      </Descriptions.Item>
      <Descriptions.Item label="Trạng thái">
        <Tag color={editData?.status ? "green" : "red"}>
          {editData?.status ? "Hoạt động" : "Không hoạt động"}
        </Tag>
      </Descriptions.Item>
    </Descriptions>
    <div className="modal-edit">
      <Button type="primary" onClick={() => setIsViewMode(false)}>
        Chỉnh sửa
      </Button>
    </div>
  </div>
);

export default ModalUserView;
