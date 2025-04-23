import React, { useEffect, useState } from 'react';
import { Modal, Form, Spin } from 'antd';
import { useDispatch } from 'react-redux';
import { createProduct, updateProduct } from '../../redux/reducers/admin/productSlice';
import { toast } from 'react-toastify';
import { getCategories } from '../../redux/reducers/admin/categorySlice';
import ModalProductForm from './components/ModalProductForm';
import ModalProductView from './components/ModalProductView';

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
  const [form] = Form.useForm();
  const [mainImageFile, setMainImageFile] = useState(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const resetImages = () => {
    setMainImageFile(null);
    setAdditionalImageFiles([]);
  };

  useEffect(() => {
    dispatch(getCategories({ page: 1, limit: 100, sortBy: 'categoryName', orderBy: 'asc' }));
  }, [dispatch]);

  useEffect(() => {
    if (isModalOpen) {
      if (editData) {
        form.setFieldsValue({
          ...editData,
          categoryName: editData.category?.categoryName || editData.categoryName,
          isFeatured: editData.isFeatured || false
        });
  
        if (editData.mainImageUrl) {
          setMainImageFile({
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: editData.mainImageUrl
          });
        } else {
          setMainImageFile(null);
        }
  
        if (editData.images && editData.images.length > 0) {
          const initialAdditionalImages = editData.images.map((image, index) => ({
            uid: `-${index + 1}`,
            name: `image-${index + 1}.png`,
            status: 'done',
            url: image
          }));
          setAdditionalImageFiles(initialAdditionalImages);
        } else {
          setAdditionalImageFiles([]);
        }
      } else {
        form.resetFields();
        resetImages();
      }
    } else {
      form.resetFields();
      resetImages();
    }
  }, [editData, form, isModalOpen]);

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      toast.error('Chỉ được upload file ảnh!');
      return Upload.LIST_IGNORE;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      toast.error('Ảnh phải nhỏ hơn 5MB!');
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  const handleMainImageChange = ({ fileList }) => {
    const validFiles = fileList.filter(file => file.status !== 'removed');
    setMainImageFile(validFiles[0] || null);
  };

  const handleAdditionalImagesChange = ({ fileList }) => {
    const validFiles = fileList.filter(file => file.status !== 'removed');
    
    const processedFiles = validFiles.map(file => {
      if (file.originFileObj) {
        return {
          uid: file.uid,
          name: file.name,
          status: 'done',
          url: URL.createObjectURL(file.originFileObj),
          originFileObj: file.originFileObj
        };
      }
      return file;
    });
    
    setAdditionalImageFiles(processedFiles);
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      
      // Handle required fields first
      if (!values.productName || !values.categoryName || !values.unitPrice || !values.stockQuantity) {
        toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
        return;
      }

      // Find category ID
      const category = categories.find(c => c.categoryName === values.categoryName);
      if (!category) {
        toast.error('Danh mục không hợp lệ!');
        return;
      }
      
      // Append all form values
      formData.append('sku', values.sku || '');
      formData.append('productName', values.productName);
      formData.append('categoryId', category.categoryId);
      formData.append('description', values.description || '');
      formData.append('unitPrice', values.unitPrice);
      formData.append('stockQuantity', values.stockQuantity);
      formData.append('isFeatured', values.isFeatured || false);

      if (mainImageFile?.originFileObj) {
        formData.append('mainImageUrl', mainImageFile.originFileObj);
      } else if (editData?.mainImageUrl && !mainImageFile) {
        try {
          const response = await fetch(editData.mainImageUrl);
          const blob = await response.blob();
          const file = new File([blob], editData.mainImageUrl.split('/').pop(), { type: blob.type });
          formData.append('mainImageUrl', file);
        } catch (error) {
          console.error('Error processing main image:', error);
        }
      }

      if (additionalImageFiles.length > 0) {
        for (const file of additionalImageFiles) {
          if (file.originFileObj) {
            formData.append('images', file.originFileObj);
          } else if (file.url) {
            const response = await fetch(file.url);
            const blob = await response.blob();
            const newFile = new File([blob], file.url.split('/').pop(), { type: blob.type });
            formData.append('images', newFile);
          }
        }
      }

      let result;
      try {
        if (editData) {
          result = await dispatch(updateProduct({ id: editData.productId, formData })).unwrap();
        } else {
          result = await dispatch(createProduct(formData)).unwrap();
        }
        toast.success(editData ? "Cập nhật thành công!" : "Thêm mới thành công!");
        setIsModalOpen(false);
        refreshData();
      } catch (error) {
        const errorMessage = error?.message || 'Lỗi khi lưu sản phẩm';
        toast.error(errorMessage);
      }
      setIsModalOpen(false);
      refreshData();
    } catch {
      toast.error('Đã xảy ra lỗi khi lưu sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={isViewMode ? '👁️ Chi tiết sản phẩm' : (editData ? '✏️ Cập nhật sản phẩm' : '➕ Thêm sản phẩm mới')}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      centered
      width={700}
      destroyOnClose
    >
      <Spin spinning={loading}>
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
            mainImageFile={mainImageFile}
            additionalImageFiles={additionalImageFiles}
            beforeUpload={beforeUpload}
            handleMainImageChange={handleMainImageChange}
            handleAdditionalImagesChange={handleAdditionalImagesChange}
            handleCancel={handleCancel}
            onFinish={handleSubmit}
            loading={loading}
            setAdditionalImageFiles={setAdditionalImageFiles}
          />
        )}
      </Spin>
    </Modal>
  );
};

export default ModalProduct;