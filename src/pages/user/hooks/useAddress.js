import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Form } from 'antd';
import {
  fetchAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  fetchAddressById
} from '../../../redux/reducers/user/accountSlice';

export default function useAddress() {
  const dispatch = useDispatch();
  const { addresses, loading, selectedAddress } = useSelector(state => state.account);
  const [addressForm] = Form.useForm();
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isAddressDetailVisible, setIsAddressDetailVisible] = useState(false);

  // Lấy danh sách địa chỉ khi mount
  const fetchAllAddresses = useCallback(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  // Add or update address
  const handleAddressSubmit = async (values) => {
    try {
      let addressId;
      if (editingAddress) {
        await dispatch(updateAddress({ addressId: editingAddress.addressId, ...values })).unwrap();
        addressId = editingAddress.addressId;
        toast.success('Cập nhật địa chỉ thành công');
      } else {
        const newAddress = await dispatch(addAddress(values)).unwrap();
        addressId = newAddress.addressId;
        toast.success('Thêm địa chỉ thành công');
      }
      if (values.isDefault) {
        await dispatch(setDefaultAddress(addressId)).unwrap();
        await dispatch(fetchAddresses());
      }
      setIsAddressModalVisible(false);
      setEditingAddress(null);
      addressForm.resetFields();
    } catch {
      toast.error(editingAddress ? 'Cập nhật địa chỉ thất bại' : 'Thêm địa chỉ thất bại');
    }
  };

  // Delete address
  const handleDeleteAddress = async (addressId) => {
    try {
      await dispatch(deleteAddress(addressId)).unwrap();
      toast.success('Xóa địa chỉ thành công');
    } catch {
      toast.error('Xóa địa chỉ thất bại');
    }
  };

  // Show add/edit modal
  const showAddressModal = () => {
    setEditingAddress(null);
    addressForm.resetFields();
    setIsAddressModalVisible(true);
  };
  const showEditAddressModal = (address) => {
    setEditingAddress(address);
    addressForm.setFieldsValue({
      receiveName: address.receiveName,
      phone: address.phone,
      fullAddress: address.fullAddress,
      isDefault: address.isDefault
    });
    setIsAddressModalVisible(true);
  };

  // Show address detail
  const showAddressDetail = async (addressId) => {
    try {
      await dispatch(fetchAddressById(addressId)).unwrap();
      setIsAddressDetailVisible(true);
    } catch (error) {
      toast.error(error || 'Không thể tải thông tin địa chỉ');
    }
  };

  // Cancel modal
  const handleAddressModalCancel = () => {
    setIsAddressModalVisible(false);
    setIsAddressDetailVisible(false);
    setEditingAddress(null);
    addressForm.resetFields();
  };

  return {
    addressForm,
    addresses,
    selectedAddress,
    fetchAllAddresses,
    loading,
    isAddressModalVisible,
    setIsAddressModalVisible,
    editingAddress,
    setEditingAddress,
    isAddressDetailVisible,
    setIsAddressDetailVisible,
    handleAddressSubmit,
    handleDeleteAddress,
    showAddressModal,
    showEditAddressModal,
    showAddressDetail,
    handleAddressModalCancel
  };
}
