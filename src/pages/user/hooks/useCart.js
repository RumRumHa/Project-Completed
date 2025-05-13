import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useState } from 'react';
import {
  fetchCartList,
  updateCartItem,
  removeCartItem,
  clearCart,
  checkout,
  updateTotals
} from '../../../redux/reducers/user/cartSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function useCart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, totalItems, totalAmount } = useSelector((state) => state.cart);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);

  // Lấy danh sách cart khi mount
  const fetchAllCart = useCallback(() => {
    dispatch(fetchCartList());
  }, [dispatch]);

  // Cập nhật lại tổng tiền/tổng số lượng khi items thay đổi
  const updateCartTotals = useCallback(() => {
    dispatch(updateTotals());
  }, [dispatch]);

  const handleQuantityChange = useCallback((cartItemId, quantity) => {
    if (quantity > 0) {
      dispatch(updateCartItem({ cartItemId, quantity }));
    }
  }, [dispatch]);

  const handleRemoveItem = useCallback((cartItemId) => {
    dispatch(removeCartItem(cartItemId));
  }, [dispatch]);

  const handleClearCart = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  const showAddressModal = useCallback(() => {
    setAddressModalVisible(true);
  }, []);

  const handleCheckout = useCallback(() => {
    if (items.length === 0) {
      toast.error('Giỏ hàng trống, vui lòng thêm sản phẩm vào giỏ hàng');
      return;
    }
    showAddressModal();
  }, [items, showAddressModal]);

  const handleConfirmCheckout = useCallback(async (selectedAddressId, onSuccess) => {
    if (!selectedAddressId) {
      toast.error('Vui lòng chọn địa chỉ nhận hàng');
      return;
    }
    try {
      setCheckoutLoading(true);
      const response = await dispatch(checkout({ addressId: selectedAddressId })).unwrap();
      setAddressModalVisible(false);
      if (onSuccess) onSuccess();
      navigate('/profile/orders');
    } catch (error) {
      let errorMessage = 'Đặt hàng thất bại, vui lòng thử lại';
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      toast.error(errorMessage);
    } finally {
      setCheckoutLoading(false);
    }
  }, [dispatch, navigate]);

  return {
    items,
    loading,
    totalItems,
    totalAmount,
    checkoutLoading,
    addressModalVisible,
    setAddressModalVisible,
    fetchAllCart,
    updateCartTotals,
    handleQuantityChange,
    handleRemoveItem,
    handleClearCart,
    showAddressModal,
    handleCheckout,
    handleConfirmCheckout,
  };
}
