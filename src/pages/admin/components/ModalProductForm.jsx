import React from 'react';
import { Form, Input, Button, Space, Select, Upload, InputNumber, Switch } from 'antd';
import { PlusOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const ModalProductForm = ({
  form,
  editData,
  categories,
  mainImageFile,
  additionalImageFiles,
  beforeUpload,
  handleMainImageChange,
  handleAdditionalImagesChange,
  handleCancel,
  onFinish,
  loading,
  setAdditionalImageFiles
}) => (
  <Form
    form={form}
    layout="vertical"
    onFinish={onFinish}
  >
    <Form.Item
      label="Mã sản phẩm"
      name="sku"
      rules={[{ required: true, message: 'Vui lòng nhập mã sản phẩm!' }]}
    >
      <Input placeholder="Nhập mã sản phẩm" />
    </Form.Item>
    <Form.Item
      label="Tên sản phẩm"
      name="productName"
      rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
    >
      <Input placeholder="Nhập tên sản phẩm" />
    </Form.Item>

    <Form.Item
      label="Danh mục"
      name="categoryName"
      rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
    >
      <Select placeholder="Chọn danh mục">
        {categories.map((cat) => (
          <Option key={cat.categoryId} value={cat.categoryName}>{cat.categoryName}</Option>
        ))}
      </Select>
    </Form.Item>

    <Form.Item
      label="Giá bán"
      name="unitPrice"
      rules={[{ required: true, message: 'Vui lòng nhập giá bán!' }]}
    >
      <InputNumber min={0} className='modal-edit-input' placeholder="Nhập giá bán" />
    </Form.Item>

    <Form.Item
      label="Số lượng tồn kho"
      name="stockQuantity"
      rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
    >
      <InputNumber min={0} className='modal-edit-input' placeholder="Nhập số lượng tồn kho" />
    </Form.Item>

    <Form.Item
      label="Mô tả"
      name="description"
    >
      <TextArea rows={3} placeholder="Nhập mô tả" />
    </Form.Item>

    <Form.Item
      label="Nổi bật"
      name="isFeatured"
      valuePropName="checked"
    >
      <Switch />
    </Form.Item>
    
    <Form.Item
      label="Ảnh chính"
      name="mainImageUrl"
      extra="Ảnh định dạng JPG/PNG, tối đa 5MB"
      rules={[{ required: !editData, message: 'Vui lòng tải lên ảnh chính!' }]}
      getValueFromEvent={e => Array.isArray(e) ? e : e && e.fileList}
    >
      <Upload
        listType="picture-card"
        beforeUpload={beforeUpload}
        onChange={handleMainImageChange}
        accept="image/*"
        fileList={mainImageFile ? [mainImageFile] : []}
        maxCount={1}
        onRemove={() => {
          setAdditionalImageFiles([]);
          return true;
        }}
      >
        {!mainImageFile && (
          <div>
            <UploadOutlined />
            <div className="modal-avatar-text">Tải lên</div>
          </div>
        )}
      </Upload>
    </Form.Item>

    <Form.Item
      label="Hình ảnh phụ"
      name="images"
      extra="Ảnh định dạng JPG/PNG, tối đa 5MB mỗi ảnh"
      getValueFromEvent={e => Array.isArray(e) ? e : e && e.fileList}
    >
      <Upload
        listType="picture-card"
        beforeUpload={beforeUpload}
        onChange={handleAdditionalImagesChange}
        multiple
        accept="image/*"
        fileList={additionalImageFiles}
        onRemove={file => {
          const newFiles = additionalImageFiles.filter(f => f.uid !== file.uid);
          setAdditionalImageFiles(newFiles);
          return false;
        }}
      >
        {additionalImageFiles.length < 5 && (
          <div>
            <PlusOutlined />
            <div className="modal-avatar-text">Tải lên</div>
          </div>
        )}
      </Upload>
    </Form.Item>

    <Form.Item className="modal-edit">
      <Space>
        <Button onClick={handleCancel}>Hủy bỏ</Button>
        <Button
          type="primary"
          htmlType="submit"
          icon={editData ? <EditOutlined /> : <PlusOutlined />}
          loading={loading}
        >
          {editData ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </Space>
    </Form.Item>
  </Form>
);

export default ModalProductForm;
