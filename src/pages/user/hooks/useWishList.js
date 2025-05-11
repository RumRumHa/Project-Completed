import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { fetchWishlist, removeFromWishlist } from '../../../redux/reducers/user/accountSlice';
import { toast } from 'react-toastify';

export default function useWishList() {
  const dispatch = useDispatch();
  const { wishlist, loading } = useSelector(state => state.account);

  // Lấy danh sách wishlist khi mount
  const fetchAllWishlist = useCallback(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  // Xóa sản phẩm khỏi wishlist
  const handleRemoveFromWishlist = useCallback(async (wishListId) => {
    try {
      await dispatch(removeFromWishlist(wishListId)).unwrap();
      toast.success('Đã xóa khỏi danh sách yêu thích');
    } catch {
      toast.error('Không thể xóa khỏi danh sách yêu thích');
    }
  }, [dispatch]);

  return {
    wishlist,
    loading,
    fetchAllWishlist,
    handleRemoveFromWishlist
  };
}
