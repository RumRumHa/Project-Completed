import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddresses, setDefaultAddress } from '../../../redux/reducers/user/accountSlice';
import { toast } from 'react-toastify';

export default function useCartAddresses() {
  const dispatch = useDispatch();
  const { addresses, loading: loadingAddresses } = useSelector(state => state.account);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const fetchAllAddresses = useCallback(async () => {
    try {
      const data = await dispatch(fetchAddresses()).unwrap();
      const defaultAddress = data.find(addr => addr.isDefault);
      if (defaultAddress) setSelectedAddressId(defaultAddress.addressId);
      else if (data.length > 0) setSelectedAddressId(data[0].addressId);
    } catch (err) {
      toast.error('Không thể tải danh sách địa chỉ');
    }
  }, [dispatch]);

  const handleSetDefaultAddress = useCallback(async (addressId) => {
    try {
      await dispatch(setDefaultAddress(addressId)).unwrap();
      await fetchAllAddresses();
      toast.success('Đã đặt làm địa chỉ mặc định');
    } catch {
      toast.error('Không thể đặt địa chỉ mặc định');
    }
  }, [dispatch, fetchAllAddresses]);

  return {
    addresses,
    loadingAddresses,
    selectedAddressId,
    setSelectedAddressId,
    fetchAllAddresses,
    handleSetDefaultAddress,
  };
}
