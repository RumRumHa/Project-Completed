import React from 'react';
import { Button, Space, Descriptions, Image } from 'antd';
import { formatPrice } from '../../../utils/formatPrice';

const ModalProductView = ({ editData, handleCancel, setIsViewMode }) => (
  <div>
    <Descriptions bordered column={2}>
      <Descriptions.Item label="Mã sản phẩm">{editData.sku}</Descriptions.Item>
      <Descriptions.Item label="Tên sản phẩm">{editData.productName}</Descriptions.Item>
      <Descriptions.Item label="Danh mục">{editData.categoryName}</Descriptions.Item>
      <Descriptions.Item label="Giá bán">
        {formatPrice(editData.unitPrice)}
      </Descriptions.Item>
      <Descriptions.Item label="Số lượng tồn kho">{editData.stockQuantity}</Descriptions.Item>
      <Descriptions.Item label="Nổi bật">{editData.isFeatured ? 'Có' : 'Không'}</Descriptions.Item>
      <Descriptions.Item label="Mô tả" span={2}>{editData.description}</Descriptions.Item>
    </Descriptions>

    <div className="modal-edit-images">
      <div className='modal-edit-images-title'>Hình ảnh sản phẩm</div>
      <Space wrap>
        {editData.mainImageUrl && (
          <Image
            width={200}
            src={editData.mainImageUrl}
            alt="Ảnh chính"
            className="modal-edit-images-image"
          />
        )}
        {editData.images?.map((image, index) => (
          <Image
            key={index}
            width={200}
            src={image}
            alt={`Ảnh phụ ${index + 1}`}
            className="modal-edit-images-image"
          />
        ))}
      </Space>
    </div>

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

export default ModalProductView;
