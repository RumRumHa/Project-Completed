import { useEffect, useState } from 'react';
import { Form, message } from 'antd';
import { useDispatch } from 'react-redux';
import { createProduct, updateProduct } from '../../../redux/reducers/admin/productSlice';
import { getCategories } from '../../../redux/reducers/admin/categorySlice';
import { toast } from 'react-toastify';

export default function useProductModalForm({ isModalOpen, editData, setIsModalOpen, refreshData, categories, setIsViewMode }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [mainImageFile, setMainImageFile] = useState(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);

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
        setMainImageFile(null);
        setAdditionalImageFiles([]);
      }
    } else {
      form.resetFields();
      setMainImageFile(null);
      setAdditionalImageFiles([]);
    }
  }, [editData, form, isModalOpen]);

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Chỉ được upload file ảnh!');
      return window.Upload ? window.Upload.LIST_IGNORE : false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Ảnh phải nhỏ hơn 5MB!');
      return window.Upload ? window.Upload.LIST_IGNORE : false;
    }
    return false;
  };

  const handleMainImageChange = ({ fileList }) => {
    const validFiles = fileList.filter(file => file.status !== 'removed');
    setMainImageFile(validFiles[0] || null);
  };

  const handleAdditionalImagesChange = ({ fileList }) => {
    const validFiles = fileList.filter(file => file.status !== 'removed');
    setAdditionalImageFiles(validFiles);
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      if (!values.productName || !values.categoryName || !values.unitPrice || !values.stockQuantity) {
        toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
        return;
      }
      const category = categories.find(c => c.categoryName === values.categoryName);
      if (!category) {
        toast.error('Danh mục không hợp lệ!');
        return;
      }
      formData.append('sku', values.sku || '');
      formData.append('productName', values.productName);
      formData.append('categoryId', category.categoryId);
      formData.append('description', values.description || '');
      formData.append('unitPrice', values.unitPrice);
      formData.append('stockQuantity', values.stockQuantity);
      formData.append('isFeatured', values.isFeatured || false);
      if (mainImageFile?.originFileObj) {
        formData.append('mainImageUrl', mainImageFile.originFileObj);
      }
      if (additionalImageFiles.length > 0) {
        for (const file of additionalImageFiles) {
          if (file.originFileObj) {
            formData.append('images', file.originFileObj);
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
    } catch {
      toast.error('Đã xảy ra lỗi khi lưu sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    mainImageProps: {
      mainImageFile,
      setMainImageFile,
      handleMainImageChange,
      beforeUpload
    },
    additionalImagesProps: {
      additionalImageFiles,
      setAdditionalImageFiles,
      handleAdditionalImagesChange,
      beforeUpload
    },
    handleSubmit
  };
}
